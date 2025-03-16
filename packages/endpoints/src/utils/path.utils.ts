export const urlHasUnescapedCharacters = (url: string) =>
  url.split('/').some((part) => /[/#?]/.test(part))

interface VariableDef {
  name: string
  index: number
}
interface PathDef {
  path: string
  variables: VariableDef[]
  joinedVariableNames: string | null
  variableIndexesSum: number | null
}
type PathLength = number
type PathPartsMap = Record<PathLength, PathDef[]>
export const getPathPartsMap = (paths: string[]) => {
  const pathPartsMaps: PathPartsMap = {}

  for (const path of paths) {
    const explodedPath = path.split('/')

    const variables: VariableDef[] = []
    for (const [i, pathPart] of explodedPath.entries()) {
      const match = /\:(.+)/.exec(pathPart)
      if (!match) {
        continue
      }

      variables.push({
        index: i - 1,
        name: match[1],
      })
    }

    const pathLength = explodedPath.length - 1
    if (!pathPartsMaps[pathLength]) {
      pathPartsMaps[pathLength] = []
    }
    pathPartsMaps[pathLength].push({
      path,
      variables,
      joinedVariableNames: variables?.length
        ? variables.map(({ name }) => name).join(',')
        : null,
      variableIndexesSum: variables?.length
        ? variables.reduce((acc, { index }) => acc + index, 0)
        : null,
    })
  }

  return pathPartsMaps
}

export const checkPathTemplatingMatching = (paths: string[]) => {
  const pathPartsMap = getPathPartsMap(paths)

  for (const pathDefs of Object.values(pathPartsMap)) {
    if (!pathDefs.length) {
      continue
    }

    for (let i = 1; i < pathDefs.length; i++) {
      const prevPathDef = pathDefs[i - 1]
      const pathDef = pathDefs[i]

      if (pathDef.variables.length !== prevPathDef.variables.length) {
        const { pathWithLeastVariables, pathWithMostVariables } =
          pathDef.variables.length < prevPathDef.variables.length
            ? {
                pathWithLeastVariables: pathDef,
                pathWithMostVariables: prevPathDef,
              }
            : {
                pathWithLeastVariables: prevPathDef,
                pathWithMostVariables: pathDef,
              }

        throw new Error(
          `The paths "${pathWithMostVariables.path}" and "${pathWithLeastVariables.path}" might lead to unintended matching if "${pathWithMostVariables.path}" has a path variable that resolves to the same URL as "${pathWithLeastVariables.path}".`,
        )
      }

      if (pathDef.variableIndexesSum !== prevPathDef.variableIndexesSum) {
        throw new Error(
          `The following paths may lead to ambiguous resolution: "${prevPathDef.path}" and "${pathDef.path}"`,
        )
      }

      if (pathDef.joinedVariableNames !== prevPathDef.joinedVariableNames) {
        throw new Error(
          `The following paths are considered identical and invalid: "${prevPathDef.path}" and "${pathDef.path}"`,
        )
      }
    }
  }
}
