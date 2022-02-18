import { IEdium, IEdiumPost, IElement, IVersion, IVersionPost } from "./types";


const API_URL = "http://127.0.0.1:59130";


export function getAllEdia(): Promise<IEdium[]> {
  return safeGetRequest(API_URL + "/edium");
}

export function createOneEdium(data: IEdiumPost): Promise<IEdium> {
  return safePostRequest(API_URL + "/edium", data);
}

export function getAllElementsFromEdium(ediumId: number): Promise<IElement[]> {
  return safeGetRequest(API_URL + `/edium/${ediumId}/elements?versions=single`);
}

export function createOneVersion(elementId: number, data: IVersionPost): Promise<IVersion> {
  return safePostRequest(API_URL + `/element/${elementId}/version`, data);
}

function safeGetRequest(url: string): Promise<any> {
  const request = fetch(url);
  return safeRequest(request);
}

function safePostRequest(url: string, data: any): Promise<any> {
  const request = fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return safeRequest(request);
}

// Return the decoded JSON data, throw custom errors.
async function safeRequest(request: Promise<Response>): Promise<any> {
  let response;
  let json;
  try {
    response = await request;
  } catch (err) {
    console.warn("Error while doing the request");
    throw new Error("Error while doing the request");
  }
  try {
    json = await response.json();
  } catch (err) {
    console.warn("Error while converting to JSON");
    throw new Error("Error while converting to JSON");
  }
  if (!response.ok) {
    console.warn("Non 200 code");
    const detail = json.detail;
    throw new Error(JSON.stringify(detail));
  }
  return json;
}
