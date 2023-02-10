import gql from "graphql-tag";

export const typeDefs = gql`
type NewsEvent {
    toppic: String
    description: String
}
type Query {
    toppic: String
    description: String
}

type Mutation {
    createNewsEvent(toppic: String, description: String) : NewsEvent
}
type Subscription {
    newsFeed: NewsEvent
}
`