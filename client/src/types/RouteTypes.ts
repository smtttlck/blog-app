import React from "react";

export default interface IRoute {
    name: string,
    path: string,
    component: React.ComponentType,
    auth: boolean
}