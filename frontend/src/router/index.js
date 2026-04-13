import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: () => import('../views/LandingView.vue'),
    meta: { title: 'Calendar - Бронирование встреч' }
  },
  {
    path: '/book',
    name: 'event-type',
    component: () => import('../views/EventTypeView.vue'),
    meta: { 
      title: 'Выберите тип встречи',
      step: 1
    }
  },
  {
    path: '/book/calendar',
    name: 'calendar',
    component: () => import('../views/BookingView.vue'),
    meta: { 
      title: 'Выберите дату и время',
      step: 2,
      requiresEventType: true
    }
  },
  {
    path: '/book/confirm',
    name: 'confirmation',
    component: () => import('../views/ConfirmationView.vue'),
    meta: { 
      title: 'Подтверждение бронирования',
      step: 3,
      requiresEventType: true,
      requiresSlot: true
    }
  },
  {
    path: '/book/success',
    name: 'success',
    component: () => import('../views/SuccessView.vue'),
    meta: { 
      title: 'Бронирование подтверждено',
      step: 4
    }
  },
  // Fallback route
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // Always scroll to top on navigation
    return { top: 0 }
  }
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Set document title
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // Note: Route guards with state checks are handled in component level
  // because useBookingState must be called within setup() context
  next()
})

export default router
