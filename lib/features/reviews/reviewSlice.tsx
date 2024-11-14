import { createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "@/lib/store";
import { toast } from "react-toastify";


const url = process.env.baseUrl || "http://localhost:3000/";

const token = sessionStorage.getItem("token") || null;


interface Review {
    _id: string;
    skillId: string;
    userId: string;
    rating: number;
    comments: string;
    exchangeId: string;
}

interface ReviewState {
    data: Review[];
}

const initialState: ReviewState = {
    data: [],
};


const reviewSlice = createSlice({
    name: "reviews",
    initialState,
    reducers: {
        getReviews: (state, action) => {
            state.data = action.payload;
        },
        createReview: (state, action) => {
            state.data.push(action.payload);
        },
        updateReview: (state, action) => {
            const index = state.data.findIndex(
                (review) => review._id === action.payload._id
            );
            if (index !== -1) {
                state.data[index] = action.payload;
            }
        },
        deleteReview: (state, action) => {
            state.data = state.data.filter((review) => review._id !== action.payload);
        },
    },
});

export const getReviews = () => async (dispatch: AppDispatch) => {
    try {
        const res = await fetch(`${url}api/reviews`);
        const data = await res.json();

        if (res.status == 200) {
            dispatch(reviewSlice.actions.getReviews(data.data));
        }
    } catch (error) {
        toast.error("Failed to get reviews");
    }
};  


export const createReview = (reviewInfo: Review) => async (dispatch: AppDispatch) => {
    try {
        const res = await fetch(`${url}api/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reviewInfo),
        });

        const data = await res.json();

        if (res.status == 200) {
            dispatch(reviewSlice.actions.createReview(data.data));
            toast.success("Review created successfully");
        }
    } catch (error) {
        toast.error("Failed to create review");
    }
};

export const updateReview = (reviewInfo: Review) => async (dispatch: AppDispatch) => {
    try {
        const res = await fetch(`${url}api/reviews/${reviewInfo._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(reviewInfo),
        });

        const data = await res.json();

        if (res.status == 200) {
            dispatch(reviewSlice.actions.updateReview(data.data));
            toast.success("Review updated successfully");
        }
    } catch (error) {
        toast.error("Failed to update review");
    }
};

export const deleteReview = (reviewId: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await fetch(`${url}api/reviews/${reviewId}`, {
            method: "DELETE",
        });

        if (res.status == 200) {
            dispatch(reviewSlice.actions.deleteReview(reviewId));
            toast.success("Review deleted successfully");
        }
    } catch (error) {
        toast.error("Failed to delete review");
    }
};


export default reviewSlice.reducer;