import { create } from 'zustand';
import type { VisitStatus } from '@/types';

interface VisitFilterState {
  selectedDate: string;
  statusFilter: VisitStatus | null;
  setSelectedDate: (date: string) => void;
  setStatusFilter: (status: VisitStatus | null) => void;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

export const useVisitFilterStore = create<VisitFilterState>((set) => ({
  selectedDate: todayISO(),
  statusFilter: null,
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
}));
