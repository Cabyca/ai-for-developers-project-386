<?php

require __DIR__ . '/../vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Events\Dispatcher;
use Illuminate\Container\Container;
use Ramsey\Uuid\Uuid;

// Initialize Eloquent
$capsule = new Capsule;
$capsule->addConnection([
    'driver' => 'sqlite',
    'database' => '/home/alex/ai-for-developers-project-386/backend/storage/database.sqlite',
]);
$capsule->setEventDispatcher(new Dispatcher(new Container));
$capsule->setAsGlobal();
$capsule->bootEloquent();

// Get request info
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = str_replace('/api', '', $uri);

// Router
header('Content-Type: application/json');

try {
    switch ($uri) {
        case '/health':
            echo json_encode(['status' => 'ok']);
            break;
            
        case '/event-types':
            if ($method === 'GET') {
                $types = Capsule::table('event_types')->get();
                echo json_encode($types);
            }
            break;
            
        case '/slots':
            if ($method === 'GET') {
                $eventTypeId = $_GET['eventTypeId'] ?? null;
                $date = $_GET['date'] ?? null;
                
                if (!$eventTypeId || !$date) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Missing parameters']);
                    break;
                }
                
                // Get event type
                $eventType = Capsule::table('event_types')->where('id', $eventTypeId)->first();
                if (!$eventType) {
                    echo json_encode([]);
                    break;
                }
                
                // Generate slots
                $slots = [];
                $duration = $eventType->durationMinutes;
                $startTime = strtotime($date . ' 09:00:00');
                $endTime = strtotime($date . ' 18:00:00');
                
                // Get existing bookings
                $bookings = Capsule::table('bookings')
                    ->where('startsAt', '>=', $date . ' 00:00:00')
                    ->where('startsAt', '<=', $date . ' 23:59:59')
                    ->get();
                
                for ($t = $startTime; $t < $endTime; $t += 900) { // 15 min steps
                    $slotStart = date('Y-m-d\TH:i:sP', $t);
                    $slotEnd = date('Y-m-d\TH:i:sP', $t + ($duration * 60));
                    
                    // Check if slot ends after 18:00
                    if (($t + ($duration * 60)) > $endTime) {
                        break;
                    }
                    
                    // Check availability
                    $isAvailable = true;
                    foreach ($bookings as $booking) {
                        $bookingStart = strtotime($booking->startsAt);
                        $bookingEnd = strtotime($booking->endsAt);
                        if ($t < $bookingEnd && ($t + ($duration * 60)) > $bookingStart) {
                            $isAvailable = false;
                            break;
                        }
                    }
                    
                    $slots[] = [
                        'startsAt' => $slotStart,
                        'endsAt' => $slotEnd,
                        'isAvailable' => $isAvailable,
                        'eventTypeId' => $eventTypeId
                    ];
                }
                
                echo json_encode($slots);
            }
            break;
            
        case '/bookings':
            if ($method === 'POST') {
                $data = json_decode(file_get_contents('php://input'), true);
                
                // Check conflict
                $existing = Capsule::table('bookings')
                    ->where('startsAt', '<', $data['startsAt'])
                    ->where('endsAt', '>', $data['startsAt'])
                    ->first();
                    
                if ($existing) {
                    http_response_code(409);
                    echo json_encode(['code' => 'SLOT_OCCUPIED', 'message' => 'Это время только что заняли, выберите другое']);
                    break;
                }
                
                $eventType = Capsule::table('event_types')->where('id', $data['eventTypeId'])->first();
                $endsAt = date('c', strtotime($data['startsAt']) + ($eventType->durationMinutes * 60));
                
                $id = Uuid::uuid4()->toString();
                Capsule::table('bookings')->insert([
                    'id' => $id,
                    'eventTypeId' => $data['eventTypeId'],
                    'startsAt' => $data['startsAt'],
                    'endsAt' => $endsAt,
                    'guestName' => $data['guestName'],
                    'guestEmail' => $data['guestEmail'],
                    'comment' => $data['comment'] ?? null,
                    'created_at' => date('Y-m-d H:i:s'),
                    'updated_at' => date('Y-m-d H:i:s')
                ]);
                
                $booking = Capsule::table('bookings')->where('id', $id)->first();
                http_response_code(201);
                echo json_encode($booking);
            }
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Not found']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
