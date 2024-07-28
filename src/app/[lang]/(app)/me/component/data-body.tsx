"use client";
import useClientFetchData from "@/hooks/useFetchData";
import { CoffeeResType } from "@/schema/coffee";
import React from "react";

const DataBody = () => {
    const { data, loading, error } = useClientFetchData<CoffeeResType[]>({
        url: "/coffee/hot",
        method: "GET",
    });

    return (
        <div>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>Error {error.message}</div>
            ) : (
                data?.map((item, index) => <p key={index}>{item.title}</p>)
            )}
        </div>
    );
};

export default DataBody;
