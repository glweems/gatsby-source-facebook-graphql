import * as graph from 'fbgraph'
import * as crypto from 'crypto'

export const sourceNodes = async (
  { actions: { createNode }, createNodeId }: any,
  {
    pageId,
    accessToken,
    params,
    settings,
  }: { pageId: string; accessToken: string; params: { fields: string[] }; settings: {} },
) => {
  // Set current access token
  graph.setAccessToken(accessToken)

  // Set any user settings for query
  graph.setOptions(settings)

  // Facebook graphql data fetch
  const getData = async (from: string, params = {}): Promise<object> => {
    return await new Promise((resolve, reject) => {
      graph.get(from, params, (err: any, res: any) => {
        if (err) {
          return reject(new Error(err.message))
        }
        if (!res) {
          return reject(new Error('Response is empty!'))
        }
        resolve(res)
      })
    })
  }

  // Strigify params
  const stringifyArray = ({ fields }: { fields: string[] }): string => {
    let string = ''
    fields.map(
      (item, i): string => (i < fields.length - 1 ? (string += `${item},`) : (string += item)),
    )
    return string
  }

  const nodeData = await getData(pageId.toString(), stringifyArray(params))

  // Source Node
  const sourceNode = {
    id: createNodeId('facebook'),
    parent: null,
    children: [],
    ...nodeData,
    internal: {
      type: `facebook`,
      content: JSON.stringify(nodeData),
      contentDigest: crypto
        .createHash('md5')
        .update(JSON.stringify(nodeData))
        .digest('hex'),
    },
  }

  return createNode(sourceNode)
}
