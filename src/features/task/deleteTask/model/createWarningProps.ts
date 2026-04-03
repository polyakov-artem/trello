export const createWarningProps = (quantity = 1) => {
  return {
    title: `Task${quantity > 1 ? 's' : ''} deletion`,
    body: `Do you really want to delete ${quantity} task${quantity > 1 ? 's' : ''}?`,
  };
};
