import { IEdium } from "./types";


const API_URL = "http://127.0.0.1:59130";


export function getAllEdia(): Promise<IEdium[]> {
  return safeRequest("/edium");
}

// Return the decoded JSON data, throw custom errors.
async function safeRequest(url: string): Promise<any> {
  let response;
  try {
    response = await fetch(API_URL + url);
  } catch (err) {
    console.warn("Error while doing the request");
    throw new Error("Error while doing the request");
  }
  try {
    return await response.json();
  } catch (err) {
    console.warn("Error while converting to JSON");
    throw new Error("Error while converting to JSON");
  }
}
