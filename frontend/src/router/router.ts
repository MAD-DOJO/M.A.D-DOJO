import { createWebHistory, createRouter } from "vue-router";
import { RouteRecordRaw } from "vue-router";

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
        path: "/ranking",
        name: "Ranking",
        component: () => import("../components/Ranking.vue"),
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;