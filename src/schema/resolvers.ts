import { PubSub } from 'graphql-subscriptions';

    const pubsub = new PubSub();     // Publish and Subscribe, Publish -> everyone gets to hear it

    interface createNewsEventInput {
        toppic: string
        description: string
    }
export const resolvers = {
    Query: {
        toppic: () => { return true },
        description: () => { return true }
    },
    Mutation: {
        createNewsEvent: (_parent : any, args : createNewsEventInput ) => {
            console.log(args);
            pubsub.publish('EVENT_CREATED', { newsFeed: args });

            // Save news events to a database: you can do that here!

            // Create something : EVENT_CREATED
            // Subscribe to something: EVENT_CREATED
            return args;
        }
    },
    Subscription: {
        newsFeed: {
            subscribe: () => pubsub.asyncIterator(['EVENT_CREATED'])
            
        }
    }
}