package boolex.logic.elements.core;

/**
 * Created by dani on 2/10/14.
 */

import boolex.logic.elements.signals.BLXSignal;
import boolex.logic.elements.signals.BLXSignalQueue;
import boolex.logic.elements.signals.BLXSignalReceiver;

import java.util.Set;
import java.util.HashSet;

public class BLXSocket implements BLXSignalReceiver {
    private Boolean value;
    private Boolean defaultValue;
    private Boolean cache;
    private Set<BLXSignalReceiver> targets;

    public BLXSocket(Boolean defaultValue) {
        this.value = this.defaultValue = defaultValue;
        this.targets = new HashSet<>();
    }

    public Boolean getValue() {
        return value;
    }

    public void setValue(Boolean value) {
        this.value = value;
    }

    public void restore() {
        value = cache;
        cache = null;
    }

    public void store() {
        cache = value;
        value = defaultValue;
    }

    public void signal(BLXSignal signal) {
        BLXSignalQueue queue = new BLXSignalQueue(false);
        queue.signal(signal);
    }

    public void testSignal(BLXSignal signal) {
        BLXSignalQueue testQueue = new BLXSignalQueue(true);
        testQueue.signal(signal);
    }

    @Override
    public void receive(BLXSignal signal, BLXSignalQueue queue) {
        BLXSocketActionFactory.getSocketAction(signal).accept(this);
        if (queue == null) {
            signal(signal);
        }
        else {
            for (BLXSignalReceiver target : targets) {
                queue.add(signal.propagate(target,0));
            }
        }
    }
}
