import Layout, { IEdit } from "../components/Layout";
import { IRect } from "../types";
export declare function updateParamLocation(updated: IRect, edit: IEdit, layout: Layout): {
    name: string;
    value: {
        x: number;
        y: number;
    };
};
export declare function updateParamOffset(updated: IRect, edit: IEdit, layout: Layout): {
    name: string;
    value: {
        x: number;
        y: number;
    };
};
export declare function updateParamWidth(updated: IRect, edit: IEdit, layout: Layout): {
    name: string;
    value: number;
};
export declare function updateParamHeight(updated: IRect, edit: IEdit, layout: Layout): {
    name: string;
    value: number;
};
