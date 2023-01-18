import { createWebHistory, createRouter } from "vue-router";
import { RouteRecordRaw } from "vue-router";
import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        alias: "/home",
        name: "Home",
        component: () => import("../components/Home.vue"),
    },
    {
        path: "/dojo",
        name: "Dojo",
        component: () => import("../components/Dojo.vue"),
    },
    {
        path: "/tournaments",
        name: "Tournaments",
        component: () => import("../components/Tournaments.vue"),
    },
    {
        path: "/trading",
        name: "Trading",
        component: () => import("../components/Trading.vue"),
    },
    {
        path: "/ranking",
        name: "Ranking",
        component: () => import("../components/Ranking.vue"),
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/home'];
    const authRequired = !publicPages.includes(to.path);
    const loggedIn = cookies.get('account');

    // trying to access a restricted page + not logged in
    // redirect to home page
    if (authRequired && !loggedIn) {
        next('/home');
    } else {
        next();
    }
});

export default router;