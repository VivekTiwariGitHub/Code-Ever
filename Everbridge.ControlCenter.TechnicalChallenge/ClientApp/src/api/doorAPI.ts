import axios from 'axios';
import { DoorModel } from '../models/DoorModel';

const baseURL = '/api/door';

const api = axios.create({
  baseURL,
});

export const fetchDoors = async (): Promise<DoorModel[]> => {
    const response = await api.get<DoorModel[]>('/');
  return response.data;
};

export const fetchDoor = async (doorId: string): Promise<DoorModel | null> => {
  const response = await api.get<DoorModel>(`/${doorId}`);
  return response.data;
};

export const addDoor = async (door: DoorModel): Promise<DoorModel> => {
    const response = await api.post<DoorModel>('/', door);
    return response.data;
};

export const removeDoor = async (doorId: string): Promise<DoorModel | null> => {
    const response = await api.delete<DoorModel>(`/${doorId}`);
    return response.data;
};

export const updateDoor = async (
    doorId: string,
    updatedDoor: DoorModel
): Promise<DoorModel> => {
    const response = await api.put<DoorModel>(`/${doorId}`, updatedDoor);
    return response.data;
};