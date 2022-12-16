import { createWebHistory, createRouter } from "vue-router";
import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        alias: "/home",
        name: "Home",
        component: () => import("../components/Home.vue"),
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;