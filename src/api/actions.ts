import {
  IEdium,
  IEdiumPatch,
  IEdiumPost,
  IElement,
  IElementPost,
  ILink,
  ILinkPost,
  IVersion,
  IVersionPost
} from "./types";


const API_URL = "http://127.0.0.1:59130";


export function getAllEdia(): Promise<IEdium[]> {
  return safeGetRequest(API_URL + "/edium");
}

export function createOneEdium(data: IEdiumPost): Promise<IEdium> {
  return safePostRequest(API_URL + "/edium", data);
}

export function modifyOneEdium(ediumId: number, data: IEdiumPatch): Promise<IEdium> {
  return safePatchRequest(API_URL + `/edium/${ediumId}`, data);
}

export function deleteOneEdium(ediumId: number): Promise<IEdium> {
  return safeDeleteRequest(API_URL + `/edium/${ediumId}`);
}

export function getAllElementsFromEdium(ediumId: number): Promise<IElement[]> {
  return safeGetRequest(API_URL + `/edium/${ediumId}/elements?versions=single`);
}

export function createOneElement(ediumId: number, data: IElementPost): Promise<IElement> {
  return safePostRequest(API_URL + `/edium/${ediumId}/element`, data);
}

export function deleteOneElement(elementId: number): Promise<IElement> {
  return safeDeleteRequest(API_URL + `/element/${elementId}`);
}

export function createOneVersion(elementId: number, data: IVersionPost): Promise<IVersion> {
  return safePostRequest(API_URL + `/element/${elementId}/version`, data);
}

export function getAllLinksFromEdium(ediumId: number): Promise<ILink[]> {
  return safeGetRequest(API_URL + `/edium/${ediumId}/links`);
}

export function createOneLink(data: ILinkPost): Promise<ILink> {
  return safePostRequest(API_URL + `/link`, data);
}

export function deleteOneLink(linkId: number): Promise<ILink> {
  return safeDeleteRequest(API_URL + `/link/${linkId}`);
}

export function getMostUsedElementNames(ediumKind: string): Promise<[string, number][]> {
  return safeGetRequest(API_URL + `/stats/most_used_elements/${ediumKind}`);
}

function safeGetRequest(url: string): Promise<any> {
  const request = fetch(url);
  return makeRequestSafe(request);
}

function safePostRequest(url: string, data: any): Promise<any> {
  const request = fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return makeRequestSafe(request);
}

function safePatchRequest(url: string, data: any): Promise<any> {
  const request = fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return makeRequestSafe(request);
}

function safeDeleteRequest(url: string): Promise<any> {
  const request = fetch(url, {
    method: "delete",
  });
  return makeRequestSafe(request);
}

// Return the decoded JSON data, throw custom errors.
async function makeRequestSafe(request: Promise<Response>): Promise<any> {
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
