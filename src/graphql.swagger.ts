const graphqlExamples = {
  getAllChannels: `query GetAllChannels($data: GetChannelsInput!) {
  getAllChannels(data: $data) { channels { id channel_name subscribers location socialblade_category views } totalCount }
}`,
  channel: `query Channel($id: String!) {
  channel(id: $id) { id channel_name subscribers location socialblade_category views }
}`,
  getAllCategories: `query GetAllCategories {
  getAllCategories { categories totalCount }
}`,
  getChannelCountries: `query GetChannelCountries {
  getChannelCountries { locations totalCount }
}`,
  currentUser: `query CurrentUser {
  currentUser { id email firstName lastName accessRole availableCredits }
}`,
  getAllGoogleProfiles: `query GetAllGoogleProfiles($data: GetGoogleInput!) {
  getAllGoogleProfiles(data: $data) { profiles { id company category country rating } totalCount }
}`,
  getGoogleCategories: `query GetGoogleCategories {
  getGoogleCategories { categories totalCount }
}`,
  getGoogleCountries: `query GetGoogleCountries {
  getGoogleCountries { countries totalCount }
}`,
  getGoogleProfile: `query GetGoogleProfile($id: String!) {
  getGoogleProfile(id: $id) { id company category country rating total_reviews }
}`,
  getLinkedinProfiles: `query GetLinkedinProfiles($data: GetLinkedinProfileInput!) {
  getLinkedinProfiles(data: $data) { profiles { id fullName firstName lastName title company location } totalCount }
}`,
  getLinkedinCompanies: `query GetLinkedinCompanies {
  getLinkedinCompanies { companies totalCount }
}`,
  getLinkedinLocations: `query GetLinkedinLocations {
  getLinkedinLocations { locations totalCount }
}`,
  getLinkedinTitles: `query GetLinkedinTitles {
  getLinkedinTitles { titles totalCount }
}`,
  getLinkedinProfile: `query GetLinkedinProfile($id: String!) {
  getLinkedinProfile(id: $id) { id fullName title company location }
}`,
  getAllRequests: `query GetAllRequests($data: GetRequestInput!) {
  getAllRequests(data: $data) { requests { id category platform location status description } totalCount }
}`,
  getAllRequestsOfUser: `query GetAllRequestsOfUser($data: GetRequestInput!) {
  getAllRequestsOfUser(data: $data) { requests { id category platform location status description } totalCount }
}`,
  getRequest: `query GetRequest($id: String!) {
  getRequest(id: $id) { id category platform location status description userId }
}`,
  getRequestCategories: `query GetRequestCategories {
  getRequestCategories { categories totalCount }
}`,
  getRequestCountries: `query GetRequestCountries {
  getRequestCountries { countries totalCount }
}`,
  getRequestPlatforms: `query GetRequestPlatforms {
  getRequestPlatforms { platforms totalCount }
}`,
  getRequestStatuses: `query GetRequestStatuses {
  getRequestStatuses { statuses totalCount }
}`,
  getAllUsers: `query GetAllUsers($data: GetUsersInput!) {
  getAllUsers(data: $data) { users { id email firstName lastName accessRole } totalCount }
}`,
  getAllUserReviews: `query GetAllUserReviews($data: GetUserReviewInput!) {
  getAllUserReviews(data: $data) { users { id firstName lastName rating reviewText } totalCount }
}`,
  addYoutubeLeads: `mutation AddYoutubeLeads($input: [BulkYoutubeInput!]!) {
  addYoutubeLeads(input: $input) { id channel_name channel_url subscribers location }
}`,
  addGoogleLeads: `mutation AddGoogleLeads($input: [BulkGoogleInput!]!) {
  addGoogleLeads(input: $input) { id company category country rating }
}`,
  addLinkedinLeads: `mutation AddLinkedinLeads($input: [BulkLinkedinInput!]!) {
  addLinkedinLeads(input: $input) { id fullName title company location }
}`,
  addRequest: `mutation AddRequest($input: [AddRequestInput!]!) {
  addRequest(input: $input) { id category platform location status description }
}`,
  createUser: `mutation CreateUser($input: RegistrationInput!) {
  createUser(input: $input) { id email firstName lastName accessRole }
}`,
  addUserReview: `mutation AddUserReview($input: AddReviewInput!) {
  addUserReview(input: $input) { id email rating reviewText }
}`,
  addUserYoutube: `mutation AddUserYoutube($input: AddReviewInput!) {
  addUserYoutube(input: $input) { id email youtube { id channel_name } }
}`,
  unlockLinkedinLead: `mutation UnlockLinkedinLead($input: UserLinkedinInput!) {
  unlockLinkedinLead(input: $input) { userId linkedinId }
}`,
  unlockYoutubeLead: `mutation UnlockYoutubeLead($input: UserYoutubeInput!) {
  unlockYoutubeLead(input: $input) { userId youtubeId }
}`,
};

const graphqlOperationNames = Object.keys(graphqlExamples)
  .map(operation => `- ${operation}`)
  .join('\n');

export function addGraphqlSwaggerDocumentation(document: any): any {
  document.paths = document.paths || {};
  document.paths['/graphql'] = {
    post: {
      tags: ['GraphQL'],
      summary: 'Execute a GraphQL query or mutation',
      description: `GraphQL uses one HTTP endpoint. Select a named operation example below, then edit its query and variables as needed.\n\nAvailable operations:\n${graphqlOperationNames}\n\nAuthentication: send a JWT in the Authorization header as Bearer <token> for protected operations.`,
      security: [{ bearer: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['query'],
              properties: {
                query: {
                  type: 'string',
                  description: 'The GraphQL document to execute.',
                },
                operationName: {
                  type: 'string',
                  description:
                    'Optional operation name when the document contains multiple operations.',
                },
                variables: {
                  type: 'object',
                  additionalProperties: true,
                  description:
                    'Values for GraphQL variables declared by query.',
                },
              },
            },
            examples: Object.keys(graphqlExamples).reduce(
              (examples, operation) => {
                examples[operation] = {
                  summary: operation,
                  value: {
                    query: graphqlExamples[operation],
                    variables: {},
                  },
                };
                return examples;
              },
              {},
            ),
          },
        },
      },
      responses: {
        200: {
          description:
            'GraphQL response containing data and, when applicable, errors.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  data: { type: 'object', additionalProperties: true },
                  errors: { type: 'array', items: { type: 'object' } },
                },
              },
            },
          },
        },
        400: { description: 'Invalid GraphQL query or variables.' },
        401: {
          description: 'Missing or invalid JWT for a protected operation.',
        },
      },
    },
  };

  return document;
}
