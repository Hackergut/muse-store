/** @module evershop
 *  EverShop GraphQL integration helpers
 */

const API_URL = "/api/graphql";

export interface EvershopProduct {
  productId: number;
  uuid: string;
  name: string;
  sku: string;
  status: number;
  url: string;
  price: {
    regular: { value: number; text: string };
    special?: { value: number; text: string };
  };
  inventory: {
    qty: number;
    isInStock: boolean;
  };
  image: {
    url: string;
    alt: string;
  } | null;
  description: unknown;
}

export interface EvershopCategory {
  categoryId: number;
  uuid: string;
  name: string;
  description: string | null;
  image: { url: string; alt: string } | null;
  url: string;
  children: Array<{
    categoryId: number;
    name: string;
    uuid: string;
  }>;
  products: {
    items: EvershopProduct[];
    total: number;
    currentPage: number;
  };
}

export async function fetchGraphQL<T = unknown>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map((e: { message: string }) => e.message).join("\n"));
  }
  return json.data as T;
}

export function getProductsQuery(limit = 50): string {
  return `
    query GetProducts {
      products(filters: [{key: "page", operation: "eq", value: "1"}, {key: "limit", operation: "eq", value: "${limit}"}]) {
        items {
          productId
          uuid
          name
          sku
          url
          price {
            regular { value text }
            special { value text }
          }
          inventory { isInStock }
          image { url alt }
        }
        total
        currentPage
      }
    }
  `;
}

export function getCategoriesQuery(): string {
  return `
    query GetCategories {
      categories {
        items {
          categoryId
          uuid
          name
          url
          image { url alt }
          children { categoryId name uuid }
        }
      }
    }
  `;
}

export function getCategoryQuery(uuid: string, limit = 50): string {
  return `
    query GetCategory($uuid: String!) {
      category(uuid: $uuid) {
        categoryId
        uuid
        name
        description
        image { url alt }
        url
        children { categoryId name uuid }
        products(filters: [{key: "limit", operation: "eq", value: "${limit}"}]) {
          items {
            productId
            uuid
            name
            sku
            url
            price {
              regular { value text }
              special { value text }
            }
            inventory { isInStock }
            image { url alt }
          }
          total
          currentPage
        }
      }
    }
  `;
}

export function addToCartMutation(
  productId: number,
  qty: number,
  variantOptions?: Record<string, string>
): string {
  const attributeInputs = variantOptions
    ? Object.entries(variantOptions)
        .map(
          ([code, value]) =>
            `{ attributeCode: "${code}", attributeValue: "${value}" }`
        )
        .join(", ")
    : "";

  return `
    mutation AddToCart {
      addCartItem(cartItem: {
        product_id: ${productId}
        qty: ${qty}
        attributes: [${attributeInputs}]
      }) {
        message
        item {
          id
          product_id
          qty
        }
      }
    }
  `;
}

export async function addToCart(
  productId: number,
  qty: number,
  variantOptions?: Record<string, string>
): Promise<{ message: string; item: { id: number; product_id: number; qty: number } }> {
  const res = await fetchGraphQL<{ addCartItem: { message: string; item: { id: number; product_id: number; qty: number } } }>(
    addToCartMutation(productId, qty, variantOptions)
  );
  return res.addCartItem;
}
