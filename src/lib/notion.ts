import { Client } from "@notionhq/client";
import {
  DatabaseObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export const getId = (db: DatabaseObjectResponse | PageObjectResponse) => {
  return db.id;
};

export const fetchDbPages = async (dbId: string, notionClient: Client) => {
  const response = await notionClient.databases.query({
    database_id: dbId,
  });

  const results = response.results;

  return results;
};

export const getIds = (dbs: (DatabaseObjectResponse | PageObjectResponse)[]) =>
  dbs.map(getId);

export const getPageNameProperty = (page: PageObjectResponse) => {
  if (page.properties.Name == undefined) {
    throw new Error('Page must have "Name" property');
  }
  const name = page.properties.Name.title[0].text.content;

  return name;
};

export const getPageNameProperties = (pages: PageObjectResponse[]) => {
  const names = pages.map(getPageNameProperty);

  return names;
};

export const createRcaDropdownItem = (page: PageObjectResponse) => {
  const id = getId(page);
  const name = getPageNameProperty(page);

  return { id, name };
};

export const createRcaDropdownItems = (pages: PageObjectResponse[]) => {
  const rcaDropdownItems = pages.map(createRcaDropdownItem);

  return rcaDropdownItems;
};
