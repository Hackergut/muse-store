import { graphql } from '../graphql';

export const addToCartMutation = graphql`
  mutation AddToCart($productId: Int!, $qty: Int!) {
    addCartItem(cartItem: { product_id: $productId, qty: $qty }) {
      message
      item {
        id
        product_id
        qty
      }
    }
  }
`;
