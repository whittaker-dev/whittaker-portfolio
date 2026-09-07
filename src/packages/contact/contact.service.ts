import axios from "axios";

import { IContactForm, IContactResponse } from "./contact.interface";

/**
 * Resolves for every outcome instead of throwing, so the form has one code path:
 * a validation reply, a rejected send and a dead network all arrive as `success: false`
 * with a translatable key. Nothing here is worth retrying automatically - a retry would
 * risk sending the same mail twice.
 */
export const sendContactMessage = async (
  payload: IContactForm,
): Promise<IContactResponse> => {
  try {
    const { data } = await axios.post<IContactResponse>(
      "/api/contact",
      payload,
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError<IContactResponse>(error) && error.response?.data) {
      return error.response.data;
    }

    return { success: false, message: "contact_error_network" };
  }
};
