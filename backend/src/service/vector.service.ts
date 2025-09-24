import { Pinecone } from '@pinecone-database/pinecone'

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const indexName = process.env.PINECONE_NAME!
const gptIndex = pc.Index(indexName);

interface CreateMemoryParams {
    vectors: number[];
    metadata: Record<string, any>;
    messageId: string;
}

interface QueryMemoryParams {
    queryVector: number[];
    limit?: number;
    metadata?: Record<string, any>;
}

export async function createMemory({ vectors, metadata, messageId }: CreateMemoryParams): Promise<void> {
    await gptIndex.upsert([{
        id: messageId,
        values: vectors,
        metadata
    }])
}

export async function queryMemory({ queryVector, limit = 5, metadata }: QueryMemoryParams): Promise<any[]> {
    const queryOptions: any = {
        vector: queryVector,
        topK: limit,
        includeMetadata: true
    };
    
    if (metadata) {
        queryOptions.filter = metadata;
    }
    
    const data = await gptIndex.query(queryOptions);
    return data.matches
}