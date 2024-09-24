 class ShiftRegisterNode {
        constructor(context, options = {}) {
          this.context = context;
          this.numStages = options.numStages || 8;
          this.onRegistersUpdated = options.onRegistersUpdated || null;
      
          this.node = new AudioWorkletNode(context, 'shift-register-processor', {
            numberOfInputs: 2,
            numberOfOutputs: this.numStages,
            channelCount: 1,
            outputChannelCount: new Array(this.numStages).fill(1),
            processorOptions: {
              numStages: this.numStages,
            },
          });
      
          this.input = new GainNode(context);
          this.trigger = new GainNode(context);
      
          this.input.connect(this.node, 0, 0);
          this.trigger.connect(this.node, 0, 1);
      
          // Initialize the registers array
          this.registers = new Array(this.numStages).fill(0);
      
          // Set up the message handler to receive register values
          this.node.port.onmessage = (event) => {
            if (event.data.registers) {
              this.registers = event.data.registers;
              // Trigger the callback if defined
              if (this.onRegistersUpdated) {
                this.onRegistersUpdated(this.registers.slice());
              }
            }
          };
        }
      
        // Method to get the current register values
        getRegisters() {
          return this.registers.slice();
        }
      
        // Method to connect an output to a destination
        connectOutput(stageIndex, destination) {
            if (stageIndex >= 0 && stageIndex < this.numStages) {
              if (destination instanceof AudioParam) {
                // When connecting to an AudioParam, only specify the output index
                this.node.connect(destination, stageIndex);
              } else if (destination instanceof AudioNode) {
                // When connecting to an AudioNode, specify both output and input indices
                if (destination.numberOfInputs > 0) {
                  this.node.connect(destination, stageIndex, 0);
                } else {
                  console.error('Destination AudioNode has no inputs.');
                }
              } else {
                console.error('Destination must be an AudioNode or AudioParam.');
              }
            } else {
              console.error('Invalid stage index:', stageIndex);
            }
          }
      
        disconnectOutput(stageIndex) {
          if (stageIndex >= 0 && stageIndex < this.numStages) {
            this.node.disconnect(stageIndex);
          } else {
            console.error('Invalid stage index:', stageIndex);
          }
        }
      }