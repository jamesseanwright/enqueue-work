'use strict';

class ListNode {
    constructor(value) {
        this.previousNode = null;
        this.value = value;
    }
}

class LinkedList {
    constructor() {
        this.headNode = null;
        this.tailNode = null;
    }

    add(value) {
        const node = new ListNode(value);

        if (!this.headNode) {
            this.headNode = node;
        }

        const previousTail = this.tailNode;
        this.tailNode = node;

        if (previousTail) {
            previousTail.previousNode = node;
        }
    }

    poll() {
        const currentHead = this.headNode;
        this.headNode = currentHead && currentHead.previousNode;

        return currentHead && currentHead.value;
    }

    get head() {
        return this.headNode && this.headNode.value;
    }

    get tail() {
        return this.tailNode && this.tailNode.value;
    }
}

const createQueue = () => new LinkedList();

module.exports = createQueue;
