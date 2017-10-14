'use strict';

class ListNode {
    constructor(previousNode, value) {
        this.previousNode = previousNode;
        this.value = value;
    }
}

class LinkedList {
    constructor() {
        this.headNode = null;
    }

    add(value) {
        if (!this.headNode) {
            this.headNode = new ListNode(null, value);
        }
    }

    get head() {
        return this.headNode.value;
    }
}

const createQueue = () => new LinkedList();

module.exports = createQueue;
