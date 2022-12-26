
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.55.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/components/Paragraph/Paragraph.svelte generated by Svelte v3.55.0 */

    const file$k = "src/components/Paragraph/Paragraph.svelte";

    function create_fragment$k(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*content*/ ctx[0]);
    			attr_dev(p, "class", "svelte-1sdm78e");
    			add_location(p, file$k, 3, 0, 49);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*content*/ 1) set_data_dev(t, /*content*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Paragraph', slots, []);
    	let { content } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (content === undefined && !('content' in $$props || $$self.$$.bound[$$self.$$.props['content']])) {
    			console.warn("<Paragraph> was created without expected prop 'content'");
    		}
    	});

    	const writable_props = ['content'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Paragraph> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('content' in $$props) $$invalidate(0, content = $$props.content);
    	};

    	$$self.$capture_state = () => ({ content });

    	$$self.$inject_state = $$props => {
    		if ('content' in $$props) $$invalidate(0, content = $$props.content);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [content];
    }

    class Paragraph extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { content: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Paragraph",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get content() {
    		throw new Error("<Paragraph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content(value) {
    		throw new Error("<Paragraph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var TitleSize;
    (function (TitleSize) {
        TitleSize["MAIN"] = "h1";
        TitleSize["SECONDARY"] = "h2";
        TitleSize["MINOR"] = "h4";
    })(TitleSize || (TitleSize = {}));

    /* src/components/Title/Title.svelte generated by Svelte v3.55.0 */
    const file$j = "src/components/Title/Title.svelte";

    // (9:40) 
    function create_if_block_2(ctx) {
    	let h4;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			if (default_slot) default_slot.c();
    			attr_dev(h4, "class", "title svelte-f2i0ix");
    			add_location(h4, file$j, 9, 2, 279);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);

    			if (default_slot) {
    				default_slot.m(h4, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(9:40) ",
    		ctx
    	});

    	return block;
    }

    // (7:44) 
    function create_if_block_1(ctx) {
    	let h2;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			if (default_slot) default_slot.c();
    			attr_dev(h2, "class", "title svelte-f2i0ix");
    			add_location(h2, file$j, 7, 2, 204);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);

    			if (default_slot) {
    				default_slot.m(h2, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(7:44) ",
    		ctx
    	});

    	return block;
    }

    // (5:0) {#if titleSize === TitleSize.MAIN}
    function create_if_block$1(ctx) {
    	let h1;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			if (default_slot) default_slot.c();
    			attr_dev(h1, "class", "title svelte-f2i0ix");
    			add_location(h1, file$j, 5, 2, 125);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);

    			if (default_slot) {
    				default_slot.m(h1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(5:0) {#if titleSize === TitleSize.MAIN}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_if_block_1, create_if_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*titleSize*/ ctx[0] === TitleSize.MAIN) return 0;
    		if (/*titleSize*/ ctx[0] === TitleSize.SECONDARY) return 1;
    		if (/*titleSize*/ ctx[0] === TitleSize.MINOR) return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Title', slots, ['default']);
    	let { titleSize } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (titleSize === undefined && !('titleSize' in $$props || $$self.$$.bound[$$self.$$.props['titleSize']])) {
    			console.warn("<Title> was created without expected prop 'titleSize'");
    		}
    	});

    	const writable_props = ['titleSize'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Title> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('titleSize' in $$props) $$invalidate(0, titleSize = $$props.titleSize);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ TitleSize, titleSize });

    	$$self.$inject_state = $$props => {
    		if ('titleSize' in $$props) $$invalidate(0, titleSize = $$props.titleSize);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [titleSize, $$scope, slots];
    }

    class Title extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { titleSize: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Title",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get titleSize() {
    		throw new Error("<Title>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleSize(value) {
    		throw new Error("<Title>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Qualification/Qualification.svelte generated by Svelte v3.55.0 */
    const file$i = "src/components/Qualification/Qualification.svelte";

    // (12:4) <Title titleSize={TitleSize.MINOR}>
    function create_default_slot$b(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*role*/ ctx[0]);
    			add_location(span, file$i, 12, 6, 367);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*role*/ 1) set_data_dev(t, /*role*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(12:4) <Title titleSize={TitleSize.MINOR}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let div1;
    	let div0;
    	let title;
    	let t0;
    	let span0;
    	let t1;
    	let t2;
    	let span1;
    	let t3;
    	let t4;
    	let paragraph;
    	let current;

    	title = new Title({
    			props: {
    				titleSize: TitleSize.MINOR,
    				$$slots: { default: [create_default_slot$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paragraph = new Paragraph({
    			props: { content: /*description*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(title.$$.fragment);
    			t0 = space();
    			span0 = element("span");
    			t1 = text(/*organizationName*/ ctx[1]);
    			t2 = space();
    			span1 = element("span");
    			t3 = text(/*timeRange*/ ctx[3]);
    			t4 = space();
    			create_component(paragraph.$$.fragment);
    			attr_dev(span0, "class", "organization-name");
    			add_location(span0, file$i, 16, 4, 420);
    			attr_dev(div0, "class", "role-metadata svelte-vqpr2l");
    			add_location(div0, file$i, 10, 2, 293);
    			attr_dev(span1, "class", "time-range");
    			add_location(span1, file$i, 18, 2, 489);
    			attr_dev(div1, "class", "qualification svelte-vqpr2l");
    			add_location(div1, file$i, 9, 0, 263);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(title, div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, span0);
    			append_dev(span0, t1);
    			append_dev(div1, t2);
    			append_dev(div1, span1);
    			append_dev(span1, t3);
    			append_dev(div1, t4);
    			mount_component(paragraph, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const title_changes = {};

    			if (dirty & /*$$scope, role*/ 17) {
    				title_changes.$$scope = { dirty, ctx };
    			}

    			title.$set(title_changes);
    			if (!current || dirty & /*organizationName*/ 2) set_data_dev(t1, /*organizationName*/ ctx[1]);
    			if (!current || dirty & /*timeRange*/ 8) set_data_dev(t3, /*timeRange*/ ctx[3]);
    			const paragraph_changes = {};
    			if (dirty & /*description*/ 4) paragraph_changes.content = /*description*/ ctx[2];
    			paragraph.$set(paragraph_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title.$$.fragment, local);
    			transition_in(paragraph.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title.$$.fragment, local);
    			transition_out(paragraph.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(title);
    			destroy_component(paragraph);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Qualification', slots, []);
    	let { role } = $$props;
    	let { organizationName } = $$props;
    	let { description } = $$props;
    	let { timeRange } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (role === undefined && !('role' in $$props || $$self.$$.bound[$$self.$$.props['role']])) {
    			console.warn("<Qualification> was created without expected prop 'role'");
    		}

    		if (organizationName === undefined && !('organizationName' in $$props || $$self.$$.bound[$$self.$$.props['organizationName']])) {
    			console.warn("<Qualification> was created without expected prop 'organizationName'");
    		}

    		if (description === undefined && !('description' in $$props || $$self.$$.bound[$$self.$$.props['description']])) {
    			console.warn("<Qualification> was created without expected prop 'description'");
    		}

    		if (timeRange === undefined && !('timeRange' in $$props || $$self.$$.bound[$$self.$$.props['timeRange']])) {
    			console.warn("<Qualification> was created without expected prop 'timeRange'");
    		}
    	});

    	const writable_props = ['role', 'organizationName', 'description', 'timeRange'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Qualification> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('role' in $$props) $$invalidate(0, role = $$props.role);
    		if ('organizationName' in $$props) $$invalidate(1, organizationName = $$props.organizationName);
    		if ('description' in $$props) $$invalidate(2, description = $$props.description);
    		if ('timeRange' in $$props) $$invalidate(3, timeRange = $$props.timeRange);
    	};

    	$$self.$capture_state = () => ({
    		Paragraph,
    		Title,
    		TitleSize,
    		role,
    		organizationName,
    		description,
    		timeRange
    	});

    	$$self.$inject_state = $$props => {
    		if ('role' in $$props) $$invalidate(0, role = $$props.role);
    		if ('organizationName' in $$props) $$invalidate(1, organizationName = $$props.organizationName);
    		if ('description' in $$props) $$invalidate(2, description = $$props.description);
    		if ('timeRange' in $$props) $$invalidate(3, timeRange = $$props.timeRange);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [role, organizationName, description, timeRange];
    }

    class Qualification extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			role: 0,
    			organizationName: 1,
    			description: 2,
    			timeRange: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Qualification",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get role() {
    		throw new Error("<Qualification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set role(value) {
    		throw new Error("<Qualification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get organizationName() {
    		throw new Error("<Qualification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set organizationName(value) {
    		throw new Error("<Qualification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get description() {
    		throw new Error("<Qualification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set description(value) {
    		throw new Error("<Qualification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get timeRange() {
    		throw new Error("<Qualification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set timeRange(value) {
    		throw new Error("<Qualification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/QualificationLabel/QualificationLabel.svelte generated by Svelte v3.55.0 */
    const file$h = "src/components/QualificationLabel/QualificationLabel.svelte";

    // (9:2) <Title titleSize={TitleSize.SECONDARY}>
    function create_default_slot$a(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*titleLabel*/ ctx[0]);
    			add_location(span, file$h, 8, 41, 306);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*titleLabel*/ 1) set_data_dev(t, /*titleLabel*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(9:2) <Title titleSize={TitleSize.SECONDARY}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div;
    	let title;
    	let t;
    	let paragraph;
    	let current;

    	title = new Title({
    			props: {
    				titleSize: TitleSize.SECONDARY,
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paragraph = new Paragraph({
    			props: { content: /*paragraphContent*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(title.$$.fragment);
    			t = space();
    			create_component(paragraph.$$.fragment);
    			attr_dev(div, "class", "qualification-label-wrapper svelte-1sskxi9");
    			add_location(div, file$h, 7, 0, 223);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(title, div, null);
    			append_dev(div, t);
    			mount_component(paragraph, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const title_changes = {};

    			if (dirty & /*$$scope, titleLabel*/ 5) {
    				title_changes.$$scope = { dirty, ctx };
    			}

    			title.$set(title_changes);
    			const paragraph_changes = {};
    			if (dirty & /*paragraphContent*/ 2) paragraph_changes.content = /*paragraphContent*/ ctx[1];
    			paragraph.$set(paragraph_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title.$$.fragment, local);
    			transition_in(paragraph.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title.$$.fragment, local);
    			transition_out(paragraph.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(title);
    			destroy_component(paragraph);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('QualificationLabel', slots, []);
    	let { titleLabel } = $$props;
    	let { paragraphContent } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (titleLabel === undefined && !('titleLabel' in $$props || $$self.$$.bound[$$self.$$.props['titleLabel']])) {
    			console.warn("<QualificationLabel> was created without expected prop 'titleLabel'");
    		}

    		if (paragraphContent === undefined && !('paragraphContent' in $$props || $$self.$$.bound[$$self.$$.props['paragraphContent']])) {
    			console.warn("<QualificationLabel> was created without expected prop 'paragraphContent'");
    		}
    	});

    	const writable_props = ['titleLabel', 'paragraphContent'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<QualificationLabel> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('titleLabel' in $$props) $$invalidate(0, titleLabel = $$props.titleLabel);
    		if ('paragraphContent' in $$props) $$invalidate(1, paragraphContent = $$props.paragraphContent);
    	};

    	$$self.$capture_state = () => ({
    		Paragraph,
    		Title,
    		TitleSize,
    		titleLabel,
    		paragraphContent
    	});

    	$$self.$inject_state = $$props => {
    		if ('titleLabel' in $$props) $$invalidate(0, titleLabel = $$props.titleLabel);
    		if ('paragraphContent' in $$props) $$invalidate(1, paragraphContent = $$props.paragraphContent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [titleLabel, paragraphContent];
    }

    class QualificationLabel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { titleLabel: 0, paragraphContent: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "QualificationLabel",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get titleLabel() {
    		throw new Error("<QualificationLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleLabel(value) {
    		throw new Error("<QualificationLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get paragraphContent() {
    		throw new Error("<QualificationLabel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set paragraphContent(value) {
    		throw new Error("<QualificationLabel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Section/Section.svelte generated by Svelte v3.55.0 */

    const file$g = "src/components/Section/Section.svelte";

    function create_fragment$g(ctx) {
    	let section;
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", "content svelte-tl1gr3");
    			add_location(div, file$g, 4, 2, 82);
    			attr_dev(section, "id", /*sectionName*/ ctx[0]);
    			attr_dev(section, "class", "svelte-tl1gr3");
    			add_location(section, file$g, 3, 0, 53);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*sectionName*/ 1) {
    				attr_dev(section, "id", /*sectionName*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Section', slots, ['default']);
    	let { sectionName } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (sectionName === undefined && !('sectionName' in $$props || $$self.$$.bound[$$self.$$.props['sectionName']])) {
    			console.warn("<Section> was created without expected prop 'sectionName'");
    		}
    	});

    	const writable_props = ['sectionName'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Section> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('sectionName' in $$props) $$invalidate(0, sectionName = $$props.sectionName);
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ sectionName });

    	$$self.$inject_state = $$props => {
    		if ('sectionName' in $$props) $$invalidate(0, sectionName = $$props.sectionName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [sectionName, $$scope, slots];
    }

    class Section extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { sectionName: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Section",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get sectionName() {
    		throw new Error("<Section>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sectionName(value) {
    		throw new Error("<Section>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const capitalize = (input) => input[0].toUpperCase() + input.slice(1);

    /* src/sections/Education/Education.svelte generated by Svelte v3.55.0 */
    const file$f = "src/sections/Education/Education.svelte";

    // (8:0) <Section sectionName={pageLabel}>
    function create_default_slot$9(ctx) {
    	let div1;
    	let qualificationlabel;
    	let t0;
    	let div0;
    	let qualification0;
    	let t1;
    	let qualification1;
    	let current;

    	qualificationlabel = new QualificationLabel({
    			props: {
    				titleLabel: capitalize(/*pageLabel*/ ctx[0]),
    				paragraphContent: "I am strongly motivated by my belief that education is important and always strive to learn something new on a daily basis."
    			},
    			$$inline: true
    		});

    	qualification0 = new Qualification({
    			props: {
    				role: "Economics and Computer Science",
    				organizationName: "The Open University of Israel",
    				timeRange: "Feb, 2018 - Sep, 2025",
    				description: "Completing a Bachelor of Arts degree in Economics and Computer Science while working a full-time job. This requires me to balance my studies with my professional responsibilities."
    			},
    			$$inline: true
    		});

    	qualification1 = new Qualification({
    			props: {
    				role: "Various technical courses",
    				organizationName: "Israeli Military Intelligence - Unit 8200",
    				timeRange: "Feb, 2013 - Feb, 2016",
    				description: "Python development, PL/SQL, data analysis and more."
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(qualificationlabel.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			create_component(qualification0.$$.fragment);
    			t1 = space();
    			create_component(qualification1.$$.fragment);
    			attr_dev(div0, "class", "skills");
    			add_location(div0, file$f, 13, 4, 646);
    			attr_dev(div1, "class", "" + (null_to_empty(`${/*pageLabel*/ ctx[0]}-wrapper`) + " svelte-1f2q6vh"));
    			add_location(div1, file$f, 8, 2, 384);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(qualificationlabel, div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			mount_component(qualification0, div0, null);
    			append_dev(div0, t1);
    			mount_component(qualification1, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(qualificationlabel.$$.fragment, local);
    			transition_in(qualification0.$$.fragment, local);
    			transition_in(qualification1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(qualificationlabel.$$.fragment, local);
    			transition_out(qualification0.$$.fragment, local);
    			transition_out(qualification1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(qualificationlabel);
    			destroy_component(qualification0);
    			destroy_component(qualification1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(8:0) <Section sectionName={pageLabel}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let section;
    	let current;

    	section = new Section({
    			props: {
    				sectionName: /*pageLabel*/ ctx[0],
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(section.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(section, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const section_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				section_changes.$$scope = { dirty, ctx };
    			}

    			section.$set(section_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(section.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(section.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(section, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Education', slots, []);
    	let pageLabel = "education";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Education> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Qualification,
    		QualificationLabel,
    		Section,
    		capitalize,
    		pageLabel
    	});

    	$$self.$inject_state = $$props => {
    		if ('pageLabel' in $$props) $$invalidate(0, pageLabel = $$props.pageLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pageLabel];
    }

    class Education extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Education",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src/sections/Experience/Experience.svelte generated by Svelte v3.55.0 */
    const file$e = "src/sections/Experience/Experience.svelte";

    // (8:0) <Section sectionName={pageLabel}>
    function create_default_slot$8(ctx) {
    	let div1;
    	let qualificationlabel;
    	let t0;
    	let div0;
    	let qualification0;
    	let t1;
    	let qualification1;
    	let t2;
    	let qualification2;
    	let t3;
    	let qualification3;
    	let current;

    	qualificationlabel = new QualificationLabel({
    			props: {
    				titleLabel: capitalize(/*pageLabel*/ ctx[0]),
    				paragraphContent: "I lead teams and develop applications. I treak great pride in building great products and working with great people."
    			},
    			$$inline: true
    		});

    	qualification0 = new Qualification({
    			props: {
    				role: "Full Stack Team Leader",
    				organizationName: "Zencity",
    				timeRange: "Mar, 2021 - Present",
    				description: "Lead and manage a team of full stack developers, set technical direction and strategy, and oversee the development and delivery of web applications. Manage project workload and contribute to the development of new technologies and processes. My role involves technical expertise, leadership, cooperation and project management skills."
    			},
    			$$inline: true
    		});

    	qualification1 = new Qualification({
    			props: {
    				role: "Full Stack Developer",
    				organizationName: "Zencity",
    				timeRange: "Jun, 2019 - Feb, 2021",
    				description: "Designed and maintained web applications using various technologies and frameworks. Worked with a team to deliver software solutions and contributed to the design and architecture of new systems. My role involved technical expertise, collaboration, innovation and problem-solving."
    			},
    			$$inline: true
    		});

    	qualification2 = new Qualification({
    			props: {
    				role: "Co-Founder and VP R&D",
    				organizationName: "Snipe",
    				timeRange: "Jan, 2017 - May, 2019",
    				description: "I co-founded an esports startup and worked closely with the CEO and other executives to align our research and development efforts with the overall business goals of the company. In this role, I developed various products using my skills in full stack development, data engineering, product management, and various other business disciplines."
    			},
    			$$inline: true
    		});

    	qualification3 = new Qualification({
    			props: {
    				role: "Data Developer Team Leader",
    				organizationName: "Israeli Military Intelligence - Unit 8200",
    				timeRange: "Feb, 2013 - Feb, 2016",
    				description: "Lead a department of Data Developers/Analysts, doing research and data mining in order to find patterns. Developing web solutions to handle the needs of high ranking decision makers."
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(qualificationlabel.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			create_component(qualification0.$$.fragment);
    			t1 = space();
    			create_component(qualification1.$$.fragment);
    			t2 = space();
    			create_component(qualification2.$$.fragment);
    			t3 = space();
    			create_component(qualification3.$$.fragment);
    			attr_dev(div0, "class", "qualifications");
    			add_location(div0, file$e, 13, 4, 640);
    			attr_dev(div1, "class", "" + (null_to_empty(`${/*pageLabel*/ ctx[0]}-wrapper`) + " svelte-vmgfcx"));
    			add_location(div1, file$e, 8, 2, 385);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(qualificationlabel, div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			mount_component(qualification0, div0, null);
    			append_dev(div0, t1);
    			mount_component(qualification1, div0, null);
    			append_dev(div0, t2);
    			mount_component(qualification2, div0, null);
    			append_dev(div0, t3);
    			mount_component(qualification3, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(qualificationlabel.$$.fragment, local);
    			transition_in(qualification0.$$.fragment, local);
    			transition_in(qualification1.$$.fragment, local);
    			transition_in(qualification2.$$.fragment, local);
    			transition_in(qualification3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(qualificationlabel.$$.fragment, local);
    			transition_out(qualification0.$$.fragment, local);
    			transition_out(qualification1.$$.fragment, local);
    			transition_out(qualification2.$$.fragment, local);
    			transition_out(qualification3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(qualificationlabel);
    			destroy_component(qualification0);
    			destroy_component(qualification1);
    			destroy_component(qualification2);
    			destroy_component(qualification3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(8:0) <Section sectionName={pageLabel}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let section;
    	let current;

    	section = new Section({
    			props: {
    				sectionName: /*pageLabel*/ ctx[0],
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(section.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(section, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const section_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				section_changes.$$scope = { dirty, ctx };
    			}

    			section.$set(section_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(section.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(section.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(section, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Experience', slots, []);
    	let pageLabel = "experience";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Experience> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Qualification,
    		QualificationLabel,
    		Section,
    		capitalize,
    		pageLabel
    	});

    	$$self.$inject_state = $$props => {
    		if ('pageLabel' in $$props) $$invalidate(0, pageLabel = $$props.pageLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pageLabel];
    }

    class Experience extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Experience",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/sections/Footer/Footer.svelte generated by Svelte v3.55.0 */

    const file$d = "src/sections/Footer/Footer.svelte";

    function create_fragment$d(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Copyright 2022 Michael.";
    			attr_dev(div, "class", "footer svelte-18n2yi8");
    			add_location(div, file$d, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/components/Button/Button.svelte generated by Svelte v3.55.0 */

    const file$c = "src/components/Button/Button.svelte";

    function create_fragment$c(ctx) {
    	let button;
    	let t;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*content*/ ctx[0]);
    			attr_dev(button, "class", "svelte-1o6o4th");
    			add_location(button, file$c, 3, 0, 49);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*content*/ 1) set_data_dev(t, /*content*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, []);
    	let { content } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (content === undefined && !('content' in $$props || $$self.$$.bound[$$self.$$.props['content']])) {
    			console.warn("<Button> was created without expected prop 'content'");
    		}
    	});

    	const writable_props = ['content'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('content' in $$props) $$invalidate(0, content = $$props.content);
    	};

    	$$self.$capture_state = () => ({ content });

    	$$self.$inject_state = $$props => {
    		if ('content' in $$props) $$invalidate(0, content = $$props.content);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [content];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { content: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get content() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set content(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-icons/components/IconBase.svelte generated by Svelte v3.55.0 */

    const file$b = "node_modules/svelte-icons/components/IconBase.svelte";

    // (18:2) {#if title}
    function create_if_block(ctx) {
    	let title_1;
    	let t;

    	const block = {
    		c: function create() {
    			title_1 = svg_element("title");
    			t = text(/*title*/ ctx[0]);
    			add_location(title_1, file$b, 18, 4, 298);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, title_1, anchor);
    			append_dev(title_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(title_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(18:2) {#if title}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let svg;
    	let if_block_anchor;
    	let current;
    	let if_block = /*title*/ ctx[0] && create_if_block(ctx);
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			if (default_slot) default_slot.c();
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[1]);
    			attr_dev(svg, "class", "svelte-c8tyih");
    			add_location(svg, file$b, 16, 0, 229);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block) if_block.m(svg, null);
    			append_dev(svg, if_block_anchor);

    			if (default_slot) {
    				default_slot.m(svg, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(svg, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*viewBox*/ 2) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconBase', slots, ['default']);
    	let { title = null } = $$props;
    	let { viewBox } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (viewBox === undefined && !('viewBox' in $$props || $$self.$$.bound[$$self.$$.props['viewBox']])) {
    			console.warn("<IconBase> was created without expected prop 'viewBox'");
    		}
    	});

    	const writable_props = ['title', 'viewBox'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<IconBase> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('viewBox' in $$props) $$invalidate(1, viewBox = $$props.viewBox);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ title, viewBox });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('viewBox' in $$props) $$invalidate(1, viewBox = $$props.viewBox);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, viewBox, $$scope, slots];
    }

    class IconBase extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { title: 0, viewBox: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconBase",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get title() {
    		throw new Error("<IconBase>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<IconBase>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<IconBase>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<IconBase>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-icons/fa/FaGithub.svelte generated by Svelte v3.55.0 */
    const file$a = "node_modules/svelte-icons/fa/FaGithub.svelte";

    // (4:8) <IconBase viewBox="0 0 496 512" {...$$props}>
    function create_default_slot$7(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z");
    			add_location(path, file$a, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 496 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 496 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$7] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FaGithub', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class FaGithub extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FaGithub",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* node_modules/svelte-icons/fa/FaLinkedinIn.svelte generated by Svelte v3.55.0 */
    const file$9 = "node_modules/svelte-icons/fa/FaLinkedinIn.svelte";

    // (4:8) <IconBase viewBox="0 0 448 512" {...$$props}>
    function create_default_slot$6(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z");
    			add_location(path, file$9, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 448 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 448 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$6] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FaLinkedinIn', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class FaLinkedinIn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FaLinkedinIn",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* node_modules/svelte-icons/fa/FaMediumM.svelte generated by Svelte v3.55.0 */
    const file$8 = "node_modules/svelte-icons/fa/FaMediumM.svelte";

    // (5:0) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$5(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M71.5 142.3c.6-5.9-1.7-11.8-6.1-15.8L20.3 72.1V64h140.2l108.4 237.7L364.2 64h133.7v8.1l-38.6 37c-3.3 2.5-5 6.7-4.3 10.8v272c-.7 4.1 1 8.3 4.3 10.8l37.7 37v8.1H307.3v-8.1l39.1-37.9c3.8-3.8 3.8-5 3.8-10.8V171.2L241.5 447.1h-14.7L100.4 171.2v184.9c-1.1 7.8 1.5 15.6 7 21.2l50.8 61.6v8.1h-144v-8L65 377.3c5.4-5.6 7.9-13.5 6.5-21.2V142.3z");
    			add_location(path, file$8, 5, 2, 124);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(5:0) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$5] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FaMediumM', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class FaMediumM extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FaMediumM",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* node_modules/svelte-icons/fa/FaTwitch.svelte generated by Svelte v3.55.0 */
    const file$7 = "node_modules/svelte-icons/fa/FaTwitch.svelte";

    // (4:8) <IconBase viewBox="0 0 448 512" {...$$props}>
    function create_default_slot$4(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M40.1 32L10 108.9v314.3h107V480h60.2l56.8-56.8h87l117-117V32H40.1zm357.8 254.1L331 353H224l-56.8 56.8V353H76.9V72.1h321v214zM331 149v116.9h-40.1V149H331zm-107 0v116.9h-40.1V149H224z");
    			add_location(path, file$7, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 448 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 448 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$4] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FaTwitch', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class FaTwitch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FaTwitch",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* node_modules/svelte-icons/fa/FaTwitter.svelte generated by Svelte v3.55.0 */
    const file$6 = "node_modules/svelte-icons/fa/FaTwitter.svelte";

    // (4:8) <IconBase viewBox="0 0 512 512" {...$$props}>
    function create_default_slot$3(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "d", "M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z");
    			add_location(path, file$6, 4, 10, 153);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(4:8) <IconBase viewBox=\\\"0 0 512 512\\\" {...$$props}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let iconbase;
    	let current;
    	const iconbase_spread_levels = [{ viewBox: "0 0 512 512" }, /*$$props*/ ctx[0]];

    	let iconbase_props = {
    		$$slots: { default: [create_default_slot$3] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < iconbase_spread_levels.length; i += 1) {
    		iconbase_props = assign(iconbase_props, iconbase_spread_levels[i]);
    	}

    	iconbase = new IconBase({ props: iconbase_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(iconbase.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(iconbase, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const iconbase_changes = (dirty & /*$$props*/ 1)
    			? get_spread_update(iconbase_spread_levels, [iconbase_spread_levels[0], get_spread_object(/*$$props*/ ctx[0])])
    			: {};

    			if (dirty & /*$$scope*/ 2) {
    				iconbase_changes.$$scope = { dirty, ctx };
    			}

    			iconbase.$set(iconbase_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(iconbase.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(iconbase.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(iconbase, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FaTwitter', slots, []);

    	$$self.$$set = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({ IconBase });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(0, $$props = assign(assign({}, $$props), $$new_props));
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [$$props];
    }

    class FaTwitter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FaTwitter",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    var IconTypes;
    (function (IconTypes) {
        IconTypes["TWITTER"] = "twitter";
        IconTypes["GITHUB"] = "github";
        IconTypes["MEDIUM"] = "medium";
        IconTypes["LINKED_IN"] = "linkedIn";
        IconTypes["TWITCH"] = "twitch";
    })(IconTypes || (IconTypes = {}));

    /* src/components/Icon/Icon.svelte generated by Svelte v3.55.0 */
    const file$5 = "src/components/Icon/Icon.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let choseniconcomponent;
    	let current;
    	choseniconcomponent = new /*ChosenIconComponent*/ ctx[0]({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(choseniconcomponent.$$.fragment);
    			attr_dev(div, "class", "icon svelte-u0uxpu");
    			add_location(div, file$5, 17, 0, 639);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(choseniconcomponent, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(choseniconcomponent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(choseniconcomponent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(choseniconcomponent);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, []);

    	const iconMapping = {
    		[IconTypes.TWITTER]: FaTwitter,
    		[IconTypes.MEDIUM]: FaMediumM,
    		[IconTypes.LINKED_IN]: FaLinkedinIn,
    		[IconTypes.TWITCH]: FaTwitch,
    		[IconTypes.GITHUB]: FaGithub
    	};

    	let { chosenIcon } = $$props;
    	const ChosenIconComponent = iconMapping[chosenIcon];

    	$$self.$$.on_mount.push(function () {
    		if (chosenIcon === undefined && !('chosenIcon' in $$props || $$self.$$.bound[$$self.$$.props['chosenIcon']])) {
    			console.warn("<Icon> was created without expected prop 'chosenIcon'");
    		}
    	});

    	const writable_props = ['chosenIcon'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('chosenIcon' in $$props) $$invalidate(1, chosenIcon = $$props.chosenIcon);
    	};

    	$$self.$capture_state = () => ({
    		FaGithub,
    		FaLinkedinIn,
    		FaMediumM,
    		FaTwitch,
    		FaTwitter,
    		IconTypes,
    		iconMapping,
    		chosenIcon,
    		ChosenIconComponent
    	});

    	$$self.$inject_state = $$props => {
    		if ('chosenIcon' in $$props) $$invalidate(1, chosenIcon = $$props.chosenIcon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ChosenIconComponent, chosenIcon];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { chosenIcon: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get chosenIcon() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set chosenIcon(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/sections/Introduction/Introduction.svelte generated by Svelte v3.55.0 */
    const file$4 = "src/sections/Introduction/Introduction.svelte";

    // (16:6) <Title titleSize={TitleSize.MAIN}         >
    function create_default_slot_1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "Hello, my name is Michael.";
    			add_location(span, file$4, 16, 9, 723);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(16:6) <Title titleSize={TitleSize.MAIN}         >",
    		ctx
    	});

    	return block;
    }

    // (13:0) <Section sectionName="introduction">
    function create_default_slot$2(ctx) {
    	let div4;
    	let div3;
    	let title;
    	let t0;
    	let div0;
    	let paragraph;
    	let t1;
    	let div1;
    	let span0;
    	let t3;
    	let span1;
    	let t5;
    	let span2;
    	let t7;
    	let span3;
    	let t9;
    	let span4;
    	let t11;
    	let span5;
    	let a0;
    	let icon0;
    	let t12;
    	let a1;
    	let icon1;
    	let t13;
    	let a2;
    	let icon2;
    	let t14;
    	let a3;
    	let icon3;
    	let t15;
    	let a4;
    	let icon4;
    	let t16;
    	let div2;
    	let button;
    	let t17;
    	let img;
    	let img_src_value;
    	let current;

    	title = new Title({
    			props: {
    				titleSize: TitleSize.MAIN,
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paragraph = new Paragraph({
    			props: {
    				content: `I am a ${/*currentRole*/ ctx[1]}. I have over ${/*yearsOfExperience*/ ctx[0]} years of experience in the field of software development and have a strong background in both front-end and back-end technologies. 
          I am skilled in leading cross-functional teams and have a track record of delivering high-quality software solutions on time and within budget. I am passionate about staying up-to-date with the latest industry trends and technologies, 
          and I am always looking for ways to improve my team's processes and productivity.`
    			},
    			$$inline: true
    		});

    	icon0 = new Icon({
    			props: { chosenIcon: IconTypes.GITHUB },
    			$$inline: true
    		});

    	icon1 = new Icon({
    			props: { chosenIcon: IconTypes.TWITTER },
    			$$inline: true
    		});

    	icon2 = new Icon({
    			props: { chosenIcon: IconTypes.MEDIUM },
    			$$inline: true
    		});

    	icon3 = new Icon({
    			props: { chosenIcon: IconTypes.LINKED_IN },
    			$$inline: true
    		});

    	icon4 = new Icon({
    			props: { chosenIcon: IconTypes.TWITCH },
    			$$inline: true
    		});

    	button = new Button({
    			props: { content: "download cv" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			create_component(title.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			create_component(paragraph.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			span0 = element("span");
    			span0.textContent = "Email";
    			t3 = space();
    			span1 = element("span");
    			span1.textContent = `${/*email*/ ctx[2]}`;
    			t5 = space();
    			span2 = element("span");
    			span2.textContent = "Location";
    			t7 = space();
    			span3 = element("span");
    			span3.textContent = "Tel-Aviv Area, Israel";
    			t9 = space();
    			span4 = element("span");
    			span4.textContent = "Social";
    			t11 = space();
    			span5 = element("span");
    			a0 = element("a");
    			create_component(icon0.$$.fragment);
    			t12 = space();
    			a1 = element("a");
    			create_component(icon1.$$.fragment);
    			t13 = space();
    			a2 = element("a");
    			create_component(icon2.$$.fragment);
    			t14 = space();
    			a3 = element("a");
    			create_component(icon3.$$.fragment);
    			t15 = space();
    			a4 = element("a");
    			create_component(icon4.$$.fragment);
    			t16 = space();
    			div2 = element("div");
    			create_component(button.$$.fragment);
    			t17 = space();
    			img = element("img");
    			attr_dev(div0, "class", "paragraph-wrapper svelte-gpc2bj");
    			add_location(div0, file$4, 18, 6, 784);
    			attr_dev(span0, "class", "category-label svelte-gpc2bj");
    			add_location(span0, file$4, 26, 8, 1451);
    			add_location(span1, file$4, 27, 8, 1501);
    			attr_dev(span2, "class", "category-label svelte-gpc2bj");
    			add_location(span2, file$4, 28, 8, 1530);
    			add_location(span3, file$4, 29, 8, 1583);
    			attr_dev(span4, "class", "category-label svelte-gpc2bj");
    			add_location(span4, file$4, 30, 8, 1626);
    			attr_dev(a0, "href", "https://github.com/Strafer14");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "rel", "noopener noreferrer");
    			add_location(a0, file$4, 32, 10, 1716);
    			attr_dev(a1, "href", "https://twitter.com/Strafer15");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "rel", "noopener noreferrer");
    			add_location(a1, file$4, 37, 10, 1897);
    			attr_dev(a2, "href", "https://medium.com/@Strafer15");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "rel", "noopener noreferrer");
    			add_location(a2, file$4, 42, 10, 2080);
    			attr_dev(a3, "href", "https://www.linkedin.com/in/michael-ostrovsky-010605108/");
    			attr_dev(a3, "rel", "noopener noreferrer");
    			attr_dev(a3, "target", "_blank");
    			add_location(a3, file$4, 47, 10, 2262);
    			attr_dev(a4, "href", "https://www.twitch.tv/strafer14");
    			attr_dev(a4, "target", "_blank");
    			attr_dev(a4, "rel", "noopener noreferrer");
    			add_location(a4, file$4, 52, 10, 2474);
    			attr_dev(span5, "class", "icons-wrapper svelte-gpc2bj");
    			add_location(span5, file$4, 31, 8, 1677);
    			attr_dev(div1, "class", "contact-details svelte-gpc2bj");
    			add_location(div1, file$4, 25, 6, 1413);
    			attr_dev(div2, "class", "contact-actions");
    			add_location(div2, file$4, 59, 6, 2683);
    			attr_dev(div3, "class", "information");
    			add_location(div3, file$4, 14, 4, 648);
    			if (!src_url_equal(img.src, img_src_value = "https://cdn.britannica.com/20/154120-050-78DE15C0/lemur.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "lamoor");
    			attr_dev(img, "class", "svelte-gpc2bj");
    			add_location(img, file$4, 63, 4, 2782);
    			attr_dev(div4, "class", "wrapper svelte-gpc2bj");
    			add_location(div4, file$4, 13, 2, 622);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			mount_component(title, div3, null);
    			append_dev(div3, t0);
    			append_dev(div3, div0);
    			mount_component(paragraph, div0, null);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			append_dev(div1, span0);
    			append_dev(div1, t3);
    			append_dev(div1, span1);
    			append_dev(div1, t5);
    			append_dev(div1, span2);
    			append_dev(div1, t7);
    			append_dev(div1, span3);
    			append_dev(div1, t9);
    			append_dev(div1, span4);
    			append_dev(div1, t11);
    			append_dev(div1, span5);
    			append_dev(span5, a0);
    			mount_component(icon0, a0, null);
    			append_dev(span5, t12);
    			append_dev(span5, a1);
    			mount_component(icon1, a1, null);
    			append_dev(span5, t13);
    			append_dev(span5, a2);
    			mount_component(icon2, a2, null);
    			append_dev(span5, t14);
    			append_dev(span5, a3);
    			mount_component(icon3, a3, null);
    			append_dev(span5, t15);
    			append_dev(span5, a4);
    			mount_component(icon4, a4, null);
    			append_dev(div3, t16);
    			append_dev(div3, div2);
    			mount_component(button, div2, null);
    			append_dev(div4, t17);
    			append_dev(div4, img);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const title_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				title_changes.$$scope = { dirty, ctx };
    			}

    			title.$set(title_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title.$$.fragment, local);
    			transition_in(paragraph.$$.fragment, local);
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			transition_in(icon2.$$.fragment, local);
    			transition_in(icon3.$$.fragment, local);
    			transition_in(icon4.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title.$$.fragment, local);
    			transition_out(paragraph.$$.fragment, local);
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			transition_out(icon2.$$.fragment, local);
    			transition_out(icon3.$$.fragment, local);
    			transition_out(icon4.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			destroy_component(title);
    			destroy_component(paragraph);
    			destroy_component(icon0);
    			destroy_component(icon1);
    			destroy_component(icon2);
    			destroy_component(icon3);
    			destroy_component(icon4);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(13:0) <Section sectionName=\\\"introduction\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let section;
    	let current;

    	section = new Section({
    			props: {
    				sectionName: "introduction",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(section.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(section, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const section_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				section_changes.$$scope = { dirty, ctx };
    			}

    			section.$set(section_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(section.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(section.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(section, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Introduction', slots, []);
    	let yearsOfExperience = new Date().getFullYear() - 2015;
    	let currentRole = "full stack team leader";
    	let email = "michael@strafer.dev";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Introduction> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Button,
    		Icon,
    		IconTypes,
    		Paragraph,
    		Section,
    		Title,
    		TitleSize,
    		yearsOfExperience,
    		currentRole,
    		email
    	});

    	$$self.$inject_state = $$props => {
    		if ('yearsOfExperience' in $$props) $$invalidate(0, yearsOfExperience = $$props.yearsOfExperience);
    		if ('currentRole' in $$props) $$invalidate(1, currentRole = $$props.currentRole);
    		if ('email' in $$props) $$invalidate(2, email = $$props.email);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [yearsOfExperience, currentRole, email];
    }

    class Introduction extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Introduction",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/Skill/Skill.svelte generated by Svelte v3.55.0 */
    const file$3 = "src/components/Skill/Skill.svelte";

    // (9:4) <Title titleSize={TitleSize.MINOR}>
    function create_default_slot$1(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*titleLabel*/ ctx[0]);
    			add_location(span, file$3, 8, 39, 286);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*titleLabel*/ 1) set_data_dev(t, /*titleLabel*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(9:4) <Title titleSize={TitleSize.MINOR}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let title;
    	let t;
    	let paragraph;
    	let current;

    	title = new Title({
    			props: {
    				titleSize: TitleSize.MINOR,
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	paragraph = new Paragraph({
    			props: { content: /*paragraphContent*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(title.$$.fragment);
    			t = space();
    			create_component(paragraph.$$.fragment);
    			attr_dev(div, "class", "skill svelte-1c8nc3");
    			add_location(div, file$3, 7, 2, 227);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(title, div, null);
    			append_dev(div, t);
    			mount_component(paragraph, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const title_changes = {};

    			if (dirty & /*$$scope, titleLabel*/ 5) {
    				title_changes.$$scope = { dirty, ctx };
    			}

    			title.$set(title_changes);
    			const paragraph_changes = {};
    			if (dirty & /*paragraphContent*/ 2) paragraph_changes.content = /*paragraphContent*/ ctx[1];
    			paragraph.$set(paragraph_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title.$$.fragment, local);
    			transition_in(paragraph.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title.$$.fragment, local);
    			transition_out(paragraph.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(title);
    			destroy_component(paragraph);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Skill', slots, []);
    	let { titleLabel } = $$props;
    	let { paragraphContent } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (titleLabel === undefined && !('titleLabel' in $$props || $$self.$$.bound[$$self.$$.props['titleLabel']])) {
    			console.warn("<Skill> was created without expected prop 'titleLabel'");
    		}

    		if (paragraphContent === undefined && !('paragraphContent' in $$props || $$self.$$.bound[$$self.$$.props['paragraphContent']])) {
    			console.warn("<Skill> was created without expected prop 'paragraphContent'");
    		}
    	});

    	const writable_props = ['titleLabel', 'paragraphContent'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Skill> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('titleLabel' in $$props) $$invalidate(0, titleLabel = $$props.titleLabel);
    		if ('paragraphContent' in $$props) $$invalidate(1, paragraphContent = $$props.paragraphContent);
    	};

    	$$self.$capture_state = () => ({
    		Paragraph,
    		Title,
    		TitleSize,
    		titleLabel,
    		paragraphContent
    	});

    	$$self.$inject_state = $$props => {
    		if ('titleLabel' in $$props) $$invalidate(0, titleLabel = $$props.titleLabel);
    		if ('paragraphContent' in $$props) $$invalidate(1, paragraphContent = $$props.paragraphContent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [titleLabel, paragraphContent];
    }

    class Skill extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { titleLabel: 0, paragraphContent: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skill",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get titleLabel() {
    		throw new Error("<Skill>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleLabel(value) {
    		throw new Error("<Skill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get paragraphContent() {
    		throw new Error("<Skill>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set paragraphContent(value) {
    		throw new Error("<Skill>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/sections/Skills/Skills.svelte generated by Svelte v3.55.0 */
    const file$2 = "src/sections/Skills/Skills.svelte";

    // (8:0) <Section sectionName={pageLabel}>
    function create_default_slot(ctx) {
    	let div1;
    	let qualificationlabel;
    	let t0;
    	let div0;
    	let skill0;
    	let t1;
    	let skill1;
    	let t2;
    	let skill2;
    	let t3;
    	let skill3;
    	let current;

    	qualificationlabel = new QualificationLabel({
    			props: {
    				titleLabel: capitalize(/*pageLabel*/ ctx[0]),
    				paragraphContent: "I am motivated by the opportunity to work with like-minded individuals who are passionate about creating something great."
    			},
    			$$inline: true
    		});

    	skill0 = new Skill({
    			props: {
    				titleLabel: "Backend Development",
    				paragraphContent: "Typescript, NodeJS, Deno, Rust, Python, Django, Express, NestJS."
    			},
    			$$inline: true
    		});

    	skill1 = new Skill({
    			props: {
    				titleLabel: "Frontend Development",
    				paragraphContent: "HTML, CSS, SASS, Javascript, Typescript, Clojurescript, React, Svelte."
    			},
    			$$inline: true
    		});

    	skill2 = new Skill({
    			props: {
    				titleLabel: "Project Management",
    				paragraphContent: "Planning and Organization, Risk Management, Leadership, Problem-solving, JIRA, Scrum."
    			},
    			$$inline: true
    		});

    	skill3 = new Skill({
    			props: {
    				titleLabel: "Cloud Infrastructure & DevOps",
    				paragraphContent: "AWS, Azure, Terraform, Serverless, CircleCI, Gitlab CI/CD."
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(qualificationlabel.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			create_component(skill0.$$.fragment);
    			t1 = space();
    			create_component(skill1.$$.fragment);
    			t2 = space();
    			create_component(skill2.$$.fragment);
    			t3 = space();
    			create_component(skill3.$$.fragment);
    			attr_dev(div0, "class", "skills svelte-153jid3");
    			add_location(div0, file$2, 13, 4, 617);
    			attr_dev(div1, "class", "" + (null_to_empty(`${/*pageLabel*/ ctx[0]}-wrapper`) + " svelte-153jid3"));
    			add_location(div1, file$2, 8, 2, 357);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(qualificationlabel, div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			mount_component(skill0, div0, null);
    			append_dev(div0, t1);
    			mount_component(skill1, div0, null);
    			append_dev(div0, t2);
    			mount_component(skill2, div0, null);
    			append_dev(div0, t3);
    			mount_component(skill3, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(qualificationlabel.$$.fragment, local);
    			transition_in(skill0.$$.fragment, local);
    			transition_in(skill1.$$.fragment, local);
    			transition_in(skill2.$$.fragment, local);
    			transition_in(skill3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(qualificationlabel.$$.fragment, local);
    			transition_out(skill0.$$.fragment, local);
    			transition_out(skill1.$$.fragment, local);
    			transition_out(skill2.$$.fragment, local);
    			transition_out(skill3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(qualificationlabel);
    			destroy_component(skill0);
    			destroy_component(skill1);
    			destroy_component(skill2);
    			destroy_component(skill3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(8:0) <Section sectionName={pageLabel}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let section;
    	let current;

    	section = new Section({
    			props: {
    				sectionName: /*pageLabel*/ ctx[0],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(section.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(section, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const section_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				section_changes.$$scope = { dirty, ctx };
    			}

    			section.$set(section_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(section.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(section.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(section, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Skills', slots, []);
    	let pageLabel = "skills";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Skills> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Skill,
    		Section,
    		QualificationLabel,
    		capitalize,
    		pageLabel
    	});

    	$$self.$inject_state = $$props => {
    		if ('pageLabel' in $$props) $$invalidate(0, pageLabel = $$props.pageLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pageLabel];
    }

    class Skills extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skills",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/sections/StickyHeader/StickyHeader.svelte generated by Svelte v3.55.0 */

    const file$1 = "src/sections/StickyHeader/StickyHeader.svelte";

    function create_fragment$1(ctx) {
    	let header;
    	let div1;
    	let span;
    	let t1;
    	let div0;
    	let ul;
    	let li0;
    	let a0;
    	let t3;
    	let li1;
    	let a1;
    	let t5;
    	let li2;
    	let a2;
    	let t7;
    	let li3;
    	let a3;
    	let header_class_value;

    	const block = {
    		c: function create() {
    			header = element("header");
    			div1 = element("div");
    			span = element("span");
    			span.textContent = "Michael";
    			t1 = space();
    			div0 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Introduction";
    			t3 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Skills";
    			t5 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Experience";
    			t7 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "Education";
    			attr_dev(span, "class", "logo svelte-1mshem8");
    			add_location(span, file$1, 13, 4, 297);
    			attr_dev(a0, "href", "#introduction");
    			attr_dev(a0, "class", "svelte-1mshem8");
    			add_location(a0, file$1, 16, 12, 377);
    			attr_dev(li0, "class", "svelte-1mshem8");
    			add_location(li0, file$1, 16, 8, 373);
    			attr_dev(a1, "href", "#skills");
    			attr_dev(a1, "class", "svelte-1mshem8");
    			add_location(a1, file$1, 17, 12, 435);
    			attr_dev(li1, "class", "svelte-1mshem8");
    			add_location(li1, file$1, 17, 8, 431);
    			attr_dev(a2, "href", "#experience");
    			attr_dev(a2, "class", "svelte-1mshem8");
    			add_location(a2, file$1, 18, 12, 481);
    			attr_dev(li2, "class", "svelte-1mshem8");
    			add_location(li2, file$1, 18, 8, 477);
    			attr_dev(a3, "href", "#education");
    			attr_dev(a3, "class", "svelte-1mshem8");
    			add_location(a3, file$1, 19, 12, 535);
    			attr_dev(li3, "class", "svelte-1mshem8");
    			add_location(li3, file$1, 19, 8, 531);
    			attr_dev(ul, "class", "svelte-1mshem8");
    			add_location(ul, file$1, 15, 6, 360);
    			attr_dev(div0, "class", "menu svelte-1mshem8");
    			add_location(div0, file$1, 14, 4, 335);
    			attr_dev(div1, "class", "wrapper svelte-1mshem8");
    			add_location(div1, file$1, 12, 2, 271);
    			attr_dev(header, "class", header_class_value = "" + (null_to_empty(/*shouldCastShadow*/ ctx[0] ? "cast-shadow" : "") + " svelte-1mshem8"));
    			add_location(header, file$1, 11, 0, 214);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div1);
    			append_dev(div1, span);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(ul, t7);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*shouldCastShadow*/ 1 && header_class_value !== (header_class_value = "" + (null_to_empty(/*shouldCastShadow*/ ctx[0] ? "cast-shadow" : "") + " svelte-1mshem8"))) {
    				attr_dev(header, "class", header_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('StickyHeader', slots, []);
    	let shouldCastShadow = false;

    	window.onscroll = function () {
    		if (window.scrollY > 0) {
    			$$invalidate(0, shouldCastShadow = true);
    		} else {
    			$$invalidate(0, shouldCastShadow = false);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<StickyHeader> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ shouldCastShadow });

    	$$self.$inject_state = $$props => {
    		if ('shouldCastShadow' in $$props) $$invalidate(0, shouldCastShadow = $$props.shouldCastShadow);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [shouldCastShadow];
    }

    class StickyHeader extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StickyHeader",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.55.0 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let body;
    	let stickyheader;
    	let t0;
    	let introduction;
    	let t1;
    	let skills;
    	let t2;
    	let experience;
    	let t3;
    	let education;
    	let t4;
    	let footer;
    	let current;
    	stickyheader = new StickyHeader({ $$inline: true });
    	introduction = new Introduction({ $$inline: true });
    	skills = new Skills({ $$inline: true });
    	experience = new Experience({ $$inline: true });
    	education = new Education({ $$inline: true });
    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			body = element("body");
    			create_component(stickyheader.$$.fragment);
    			t0 = space();
    			create_component(introduction.$$.fragment);
    			t1 = space();
    			create_component(skills.$$.fragment);
    			t2 = space();
    			create_component(experience.$$.fragment);
    			t3 = space();
    			create_component(education.$$.fragment);
    			t4 = space();
    			create_component(footer.$$.fragment);
    			add_location(body, file, 8, 0, 410);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			mount_component(stickyheader, body, null);
    			append_dev(body, t0);
    			mount_component(introduction, body, null);
    			append_dev(body, t1);
    			mount_component(skills, body, null);
    			append_dev(body, t2);
    			mount_component(experience, body, null);
    			append_dev(body, t3);
    			mount_component(education, body, null);
    			append_dev(body, t4);
    			mount_component(footer, body, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stickyheader.$$.fragment, local);
    			transition_in(introduction.$$.fragment, local);
    			transition_in(skills.$$.fragment, local);
    			transition_in(experience.$$.fragment, local);
    			transition_in(education.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stickyheader.$$.fragment, local);
    			transition_out(introduction.$$.fragment, local);
    			transition_out(skills.$$.fragment, local);
    			transition_out(experience.$$.fragment, local);
    			transition_out(education.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    			destroy_component(stickyheader);
    			destroy_component(introduction);
    			destroy_component(skills);
    			destroy_component(experience);
    			destroy_component(education);
    			destroy_component(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Education,
    		Experience,
    		Footer,
    		Introduction,
    		Skills,
    		StickyHeader
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
