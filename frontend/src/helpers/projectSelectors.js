import { createSelector } from "reselect";

const selectProjectIds = (state) => state.project.allIds;
const selectProjectsById = (state) => state.project.byId;

export const selectProjects = createSelector(
  [selectProjectIds, selectProjectsById],
  (allIds, byId) => allIds.map((id) => byId[id])
);
