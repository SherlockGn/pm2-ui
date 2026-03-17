import { createRouter, createWebHashHistory } from 'vue-router'

export const router = createRouter({
    routes: [
        {
            path: '/',
            name: 'index',
            redirect: {
                name: 'login'
            }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('./pages/Login.vue')
        },
        {
            name: 'dashboard',
            path: '/dashboard',
            component: () => import('./pages/Dashboard.vue'),
            children: [
                {
                    path: '/management',
                    name: 'management',
                    component: () => import('./pages/Home.vue')
                },
                {
                    path: '/logs',
                    name: 'logs',
                    component: () => import('./pages/Log.vue')
                },
                {
                    path: '/metric',
                    name: 'metric',
                    component: () => import('./pages/Metric.vue')
                },
                {
                    path: '/communication',
                    name: 'communication',
                    component: () => import('./pages/Communication.vue')
                },
                {
                    path: '/deployment',
                    name: 'deployment',
                    component: () => import('./pages/Deployment.vue')
                },
                {
                    path: '/action',
                    name: 'action',
                    component: () => import('./pages/Action.vue')
                },
                {
                    path: '/backup',
                    name: 'backup',
                    component: () => import('./pages/Backup.vue')
                },
                {
                    path: '/general',
                    name: 'general',
                    component: () => import('./pages/General.vue')
                },
                {
                    path: '/security',
                    name: 'security',
                    component: () => import('./pages/Security.vue')
                },
                {
                    path: '/database',
                    name: 'database',
                    component: () => import('./pages/Database.vue')
                },
                {
                    path: '/adminlog',
                    name: 'adminLog',
                    component: () => import('./pages/AdminLog.vue')
                },
                {
                    path: '/user',
                    name: 'user',
                    component: () => import('./pages/User.vue')
                }
            ]
        }
    ],
    history: createWebHashHistory()
})
