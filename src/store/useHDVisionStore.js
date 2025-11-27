import { create } from "zustand";

const useHDVisionStore = create((set) => ({
	// Initial state
	user: null,
	setUser: (user) => set({ user }),
}));

export default useHDVisionStore;
