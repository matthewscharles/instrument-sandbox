export async function connect(context: any, output: AudioNode, destination: AudioNode | AudioParam | AudioDestinationNode) {
    if (!context.initialized) {
        console.log('Node not initialized');
        await context.initPromise; // Wait for initialization
    }
    
    console.log('Connecting', output, 'to', destination);
    
    if (destination instanceof AudioDestinationNode) {
        // console.log('destination is AudioDestinationNode', destination);
        output.connect(destination);
        // console.log('connected to AudioDestinationNode', context, destination);
    } else if (destination instanceof AudioNode) {
        output.connect(destination);
        // console.log('connected to AudioNode', context, destination);
    } else if (destination instanceof AudioParam) {
        output.connect(destination);
        // console.log('connected to AudioParam', context, destination);
    } else {
        console.error('Destination must be an AudioNode, AudioParam, or AudioDestinationNode.');
    }
}

export async function disconnect(context: any, output: AudioNode, destination?: AudioNode | AudioParam | AudioDestinationNode, outputIndex: number = 0, inputIndex: number = 0) {
    if (!context.initialized) {
        console.log('Node not initialized');
        await context.initPromise; // Wait for initialization
    }
    
    if (!destination) {
        output.disconnect();
    } else {
        if (destination instanceof AudioDestinationNode) {
            // console.log('destination is AudioDestinationNode', destination);
            output.disconnect(destination);
        } else if (destination instanceof AudioParam) {
            output.disconnect(destination, outputIndex);
        } else if (destination instanceof AudioNode) {
            output.disconnect(destination, outputIndex, inputIndex);
        } else {
            console.error('Destination must be an AudioNode, AudioParam, or AudioDestinationNode.\n Disconnecting all outputs from this node');
            output.disconnect();
        }
    }
}