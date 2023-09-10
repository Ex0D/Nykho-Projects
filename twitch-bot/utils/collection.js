class Collection extends Map
{
    ensure(key, defaultValueGenerator)
    {
        if (this.has(key))
        {
            return this.get(key);
        }

        if (typeof defaultValueGenerator !== 'function')
        {
            throw new Error(`${defaultValueGenerator} is not a function`);
        }

        const defaultValue = defaultValueGenerator(key, this);
        this.set(key, defaultValue);
        return defaultValue;
    }

    hasAll(...keys)
    {
        return keys.every((key) => super.has(key));
    }

    hasAny(...keys)
    {
        return keys.some((key) => super.has(key));
    }

    first(amount)
    {
        if (amount === undefined)
        {
            return this.values().next().value;
        }

        if (amount < 0)
        {
            return this.last(amount * -1);
        }

        amount = Math.min(this.size, amount);
        const iter = this.values();
        return Array.from({ length: amount }, () => iter.next().value);
    }

    firstKey(amount)
    {
        if (amount === undefined)
        {
            return this.values().next().value;
        }

        if (amount < 0)
        {
            return this.lastKey(amount * -1);
        }

        amount = Math.min(this.size, amount);
        const iter = this.values();
        return Array.from({ length: amount }, () => iter.next().value);
    }

    last(amount)
    {
        const arr = [...this.values()];

        if (amount === undefined)
        {
            return arr[arr.length - 1];
        }

        if (amount < 0)
        {
            return this.first(amount * -1);
        }

        if (!amount)
        {
            return [];
        }

        return arr.slice(-amount);
    }

    lastKey(amount)
    {
        const arr = [...this.keys()];

        if (amount === undefined)
        {
            return arr[arr.length - 1];
        }

        if (amount < 0)
        {
            return this.first(amount * -1);
        }

        if (!amount)
        {
            return [];
        }

        return arr.slice(-amount);
    }

    at(index)
    {
        index = Math.floor(index);
        const arr = [...this.values()];
        return arr.at(index);
    }

    keyAt(index)
    {
        index = Math.floor(index);
        const arr = [...this.keys()];
        return arr.at(index);
    }

    random(amount)
    {
        const arr = [...this.values()];
        if (amount === undefined)
        {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        if (!arr.length || !amount)
        {
            return [];
        }

        return Array.from({ length: Math.min(amount, arr.length) }, () => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
    }

    randomKey(amount)
    {
        const arr = [...this.keys()];
        if (amount === undefined)
        {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        if (!arr.length || !amount)
        {
            return [];
        }

        return Array.from({ length: Math.min(amount, arr.length) }, () => arr.splice(Math.floor(Math.random() * arr.length), 1)[0]);
    }

    reverse()
    {
        const entries = [...this.entries()].reverse();
        this.clear();
        for (const [key, value] of entries)
        {
            this.set(key, value);
        }

        return this;
    }

    find(fn, thisArg)
    {
        if (typeof fn !== "function")
        {
            throw new Error(`${fn} is not a function`);
        }

        if (thisArg !== undefined)
        {
            fn = fn.bind(thisArg);
        }

        for (const [key, val] of this)
        {
            if (fn(val, key, this))
            {
                return key;
            }
        }

        return undefined;
    }

    findKey(fn, thisArg)
    {
        if (typeof fn !== "function")
        {
            throw new Error(`${fn} is not a function`);
        }

        if (thisArg !== undefined)
        {
            fn = fn.bind(thisArg);
        }

        for (const [key, val] of this)
        {
            if (fn(val, key, this))
            {
                return val;
            }
        }

        return undefined;
    }

    sweep(fn, thisArg)
    {
        if (typeof fn !== "function")
        {
            throw new Error(`${fn} is not a function`);
        }

        if (thisArg !== undefined)
        {
            fn = fn.bind(thisArg);
        }

        const previousSize = this.size;

        for (const [key, val] in this)
        {
            if (fn(val, key, this))
            {
                this.delete(key);
            }
        }

        return previousSize - this.size;
    }

    filter(fn, thisArg)
    {
        if (typeof fn !== "function")
        {
            throw new Error(`${fn} is not a function`);
        }

        if (thisArg !== undefined)
        {
            fn = fn.bind(thisArg);
        }

        const results = new this.constructor[Symbol.species]();

        for (const [key, val] of this)
        {
            if (fn(val, key, this))
            {
                results.set(key, val);
            }

            return results;
        }
    }

    partition(fn, thisArg)
    {
        if (typeof fn !== "function")
        {
            throw new Error(`${fn} is not a function`);
        }

        if (thisArg !== undefined)
        {
            fn = fn.bind(thisArg);
        }

        const results = 
        [
            new this.constructor[Symbol.species](),
            new this.constructor[Symbol.species]()
        ];

        for (const [key, val] of this)
        {
            if (fn(val, key, this)) 
            {
                results[0].set(key, val);
            }
            else 
            {
                results[1].set(key, val);
            }
        }

        return results;
    }

    flatMap(fn, thisArg)
    {
        const collections = this.map(fn, thisArg);
        return new this.constructor[Symbol.species]().concat(...collections);
    }

    map(fn, thisArg)
    {
        if (typeof fn !== "function")
        {
            throw new Error(`${fn} is not a function`);
        }

        if (thisArg !== undefined)
        {
            fn = fn.bind(thisArg);
        }

        const iter = this.entries();
        return Array.from({ length: this.size }, () =>
        {
            const [key, value] = iter.next().value;
            return fn(value, key, this);
        });
    }

    mapValues(fn, thisArg)
    {
        if (typeof fn !== "function")
        {
            throw new Error(`${fn} is not a function`);
        }

        if (thisArg !== undefined)
        {
            fn = fn.bind(thisArg);
        }

        const coll = new this.constructor[Symbol.species]();

        for (const [key, val] of this)
        {
            coll.set(key, fn(val, key, this));
        }

        return coll;
    }

    some(fn, thisArg)
    {
        if (typeof fn !== "function")
        {
            throw new Error(`${fn} is not a function`);
        }

        if (thisArg !== undefined)
        {
            fn = fn.bind(thisArg);
        }

        for (const [key, val] of this)
        {
            if (fn(val, key, this))
            {
                return true;
            }
        }

        return false;
    }

    every(fn, thisArg)
    {
        if (typeof fn !== "function")
        {
            throw new Error(`${fn} is not a function`);
        }

        if (thisArg !== undefined)
        {
            fn = fn.bind(thisArg);
        }

        for (const [key, val] of this)
        {
            if (!fn(val, key, this))
            {
                return false;
            }
        }

        return true;
    }

    reduce(fn, initialValue)
    {
        if (typeof fn !== "function")
        {
            throw new Error(`${fn} is not a function`);
        }

        let accumulator;
        const iterator = this.entries();

        if (initialValue === undefined)
        {
            if (this.size === 0)
            {
                throw new Error("Reduce of empty collection with no initial value");
            }

            accumulator = iterator.next().value[1];
        }
        else
        {
            accumulator = initialValue
        }

        for (const [key, value] of iterator)
        {
            accumulator = fn(accumulator, key, value, this);
        }

        return accumulator;
    }

    each(fn, thisArg)
    {
        if (typeof fn !== "function")
        {
            throw new Error(`${fn} is not a function`);
        }

        if (thisArg !== undefined)
        {
            fn = fn.bind(thisArg);
        }

        for (const [key, value] of this)
        {
            fn(value, key, this);
        }

        return this;
    }

    tap(fn, thisArg)
    {
        if (typeof fn !== "function")
        {
            throw new Error(`${fn} is not a function`);
        }

        if (thisArg !== undefined)
        {
            fn = fn.bind(thisArg);
        }

        fn(this);
        return this;
    }

    clone()
    {
        return new this.constructor[Symbol.species](this);
    }

    concat(...collections)
    {
        const newColl = this.clone();
        for (const coll of collections)
        {
            for (const [key, val] of coll)
            {
                newColl.set(key, val);
            }
        }

        return newColl;
    }

    equals(collection)
    {
        if (!collection)
        {
            return false;
        }

        if (this === collection)
        {
            return true;
        }

        if (this.size !== collection.size)
        {
            return false;
        }
    }

    sort(compareFunction = Collection.defaultSort)
    {
        const entries = [...this.entries()];
        entries.sort((a, b) => compareFunction(a[1], b[1], a[0], b[0]));

        super.clear();

        for (const [key, value] of entries)
        {
            super.set(key, value);
        }

        return this;
    }

    intersect(other)
    {
        const coll = new this.constructor[Symbol.species]();
        for (const [key, value] of other)
        {
            if (this.has(key) && Object.is(value, this.get(key)))
            {
                coll.set(key, value);
            }
        }

        return coll;
    }

    substract(other)
    {
        const coll = new this.constructor[Symbol.species]();
        for (const [key, value] of other)
        {
            if (!this.has(key))
            {
                coll.set(key, value);
            }
        }

        for (const [key, value] of this)
        {
            if (!other.has(key) || !Object.is(value, other.get(key)))
            {
                coll.set(key, value);
            }
        }

        return coll;
    }

    difference(other)
    {
        const coll = new this.constructor[Symbol.species]();

        for (const [key, value] of other)
        {
            if (!this.has(key))
            {
                coll.set(key, value);
            }
        }

        for (const [key, value] of this)
        {
            if (!other.has(key))
            {
                coll.set(key, value);
            }
        }

        return coll;
    }

    merge(other, whenInSelf, whenInOther, whenInBoth)
    {
        const coll = new this.constructor[Symbol.species]();
        const keys = new Set([...this.keys(), ...other.keys()]);

        for (const key of keys) 
        {
            const hasInSelf = this.has(key);
            const hasInOther = other.has(key);
            if (hasInSelf && hasInOther) 
            {
                const result = whenInBoth(this.get(key), other.get(key), key);
                if (result.keep)
                {
                    coll.set(key, result.value);
                }
            } 
            else if (hasInSelf)
            {
                const result = whenInSelf(this.get(key), key);
                if (result.keep)
                {
                    coll.set(key, result.value);
                }
            }
            else if (hasInOther) 
            {
                const result = whenInOther(other.get(key), key);
                if (result.keep)
                {
                    coll.set(key, result.value);
                }
            }
        }
        return coll;
    }

    sorted(compareFunction = Collection.defaultSort)
    {
        return new this.constructor[Symbol.species](this).sort((av, bv, ak, bk) => compareFunction(av, bv, ak, bk));
    }

    toJSON()
    {
        return [...this.values()];
    }

    static defaultSort(firstValue, secondValue)
    {
        return Number(firstValue > secondValue) || Number(firstValue === secondValue) - 1;
    }

    static combineEntries(entries, combine)
    {
        const coll = new Collection();

        for (const [key, value] of entries)
        {
            if (coll.has(key))
            {
                coll.set(key, combine(coll.get(key), value, key));
            }
            else
            {
                coll.set(key, value);
            }
        }

        return coll;
    }
}

module.exports = Collection;