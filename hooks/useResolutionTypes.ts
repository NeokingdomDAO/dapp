import { getResolutionTypesQuery } from "@graphql/queries/subgraph/get-resolution-types-query";

import { useGraphQL } from "@lib/graphql/useGraphql";

import { RESOLUTION_TYPES_TEXTS } from "../i18n/resolution";
import { ResolutionTypeEntity } from "../types";

export default function useResolutionTypes(): { types: ResolutionTypeEntity[]; error?: boolean; isLoading?: boolean } {
  const { data, error, isLoading } = useGraphQL(getResolutionTypesQuery);

  if (!data || error || isLoading) {
    return { types: [], error, isLoading };
  }

  const resolutionTypes = [
    ...data.resolutionTypes
      .filter(
        (resolutionType: any) =>
          !RESOLUTION_TYPES_TEXTS[resolutionType.name] || !RESOLUTION_TYPES_TEXTS[resolutionType.name].disabled,
      )
      .reduce((all: ResolutionTypeEntity[], current: any) => {
        if (current.name === "routine") {
          return [
            ...all,
            current,
            {
              id: "routineVeto",
              name: "routineVeto",
            },
          ] as ResolutionTypeEntity[];
        }
        return [...all, current];
      }, [] as ResolutionTypeEntity[]),
  ];

  return { types: resolutionTypes, error, isLoading };
}
