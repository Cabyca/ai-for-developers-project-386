<template>
  <div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <!-- Base gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50"></div>
    
    <!-- Gradient orb 1 - Soft Blue -->
    <div 
      class="absolute w-[900px] h-[900px] rounded-full blur-[150px] opacity-40 animate-float-slow"
      style="background: radial-gradient(circle, #e0e7ff 0%, #c7d2fe 50%, transparent 70%); top: -30%; left: -20%;"
    ></div>
    
    <!-- Gradient orb 2 - Soft Pink -->
    <div 
      class="absolute w-[700px] h-[700px] rounded-full blur-[130px] opacity-35 animate-float-medium"
      style="background: radial-gradient(circle, #fae8ff 0%, #f5d0fe 50%, transparent 70%); top: 10%; right: -15%;"
    ></div>
    
    <!-- Gradient orb 3 - Soft Mint -->
    <div 
      class="absolute w-[800px] h-[800px] rounded-full blur-[140px] opacity-25 animate-float-fast"
      style="background: radial-gradient(circle, #f0fdf4 0%, #dcfce7 50%, transparent 70%); bottom: -20%; left: 10%;"
    ></div>
    
    <!-- Gradient orb 4 - Warm Peach -->
    <div 
      class="absolute w-[600px] h-[600px] rounded-full blur-[110px] opacity-30 animate-pulse-slow"
      style="background: radial-gradient(circle, #fff7ed 0%, #ffedd5 50%, transparent 70%); bottom: 10%; right: 15%;"
    ></div>
    
    <!-- Subtle grid pattern -->
    <div class="absolute inset-0 opacity-[0.015]" style="background-image: linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px); background-size: 60px 60px;"></div>
  </div>
</template>

<style scoped>
@keyframes float-slow {
  0%, 100% { 
    transform: translate(0, 0) scale(1); 
  }
  25% { 
    transform: translate(40px, -30px) scale(1.08); 
  }
  50% { 
    transform: translate(-20px, 40px) scale(0.95); 
  }
  75% { 
    transform: translate(30px, 20px) scale(1.03); 
  }
}

@keyframes float-medium {
  0%, 100% { 
    transform: translate(0, 0) scale(1); 
  }
  33% { 
    transform: translate(-35px, 25px) scale(1.12); 
  }
  66% { 
    transform: translate(25px, -35px) scale(0.88); 
  }
}

@keyframes float-fast {
  0%, 100% { 
    transform: translate(0, 0) scale(1); 
  }
  50% { 
    transform: translate(30px, -25px) scale(1.15); 
  }
}

@keyframes pulse-slow {
  0%, 100% { 
    opacity: 0.25; 
    transform: scale(1); 
  }
  50% { 
    opacity: 0.4; 
    transform: scale(1.08); 
  }
}

.animate-float-slow {
  animation: float-slow 30s ease-in-out infinite;
}

.animate-float-medium {
  animation: float-medium 20s ease-in-out infinite;
}

.animate-float-fast {
  animation: float-fast 15s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 12s ease-in-out infinite;
}
</style>
