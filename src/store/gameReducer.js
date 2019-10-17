export const CHARACTER_SELECT = "CHARACTER_SELECT";

const initState = {
  showUi: true
};

export const characterSelect = () => ({
  type: CHARACTER_SELECT
});

export const gameReducer = (
  state = initState,
  action
) => {
  console.log("Action:", action);
  switch (action.type) {
    case CHARACTER_SELECT:
      return { ...state, showUi: !state.showUi, character: action.character }

    default:
      return state;
  }
};
