import * as graph from 'fbgraph'
import * as crypto from 'crypto'

export const sourceNodes = async (
  { actions: { createNode }, createNodeId }: any,
  {
    pageId,
    accessToken,
    params,
  }: { pageId: string; accessToken: string; params: { fields: string[] } },
) => {
  // Set current access token
  graph.setAccessToken(accessToken)

  const options = {
    timeout: 3000,
    pool: { maxSockets: Infinity },
    headers: { connection: 'keep-alive' },
  }

  // Facebook graphql data fetch
  const getData = async (from: string, params = {}): Promise<object> => {
    return await new Promise((resolve, reject) => {
      graph.setOptions(options).get(from, params, (err: any, res: any) => {
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

  // Format params for fbgraph
  const formatParams = ({ fields }: { fields: string[] }): { fields: string } => {
    let string = ''
    fields.map(
      (item, i): string => (i < fields.length - 1 ? (string += `${item},`) : (string += item)),
    )
    return { fields: string }
  }
  const nodeData = await getData(pageId.toString(), formatParams(params))

  const sourceNodes = {
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

  return createNode(sourceNodes)
}
