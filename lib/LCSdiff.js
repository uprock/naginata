function lcs(x, y) {
    var symbols = {},
        r = 0, p = 0, p1, L = 0, idx,
        m = x.length, n = y.length,
        S = new Array(m < n ? n : m);
    p1 = popsym(0);
    for (i = 0; i < m; i++) {
        p = (r === p) ? p1 : popsym(i);
        p1 = popsym(i + 1);
        idx = (p > p1) ? (i++, p1) : p;
        if (idx === n) {
            p = popsym(i);
        }
        else {
            r = idx;
            S[L++] = x[i];
        }
    }
    return S.slice(0, L);

    function popsym(index) {
        var s = x[index],
            pos = symbols[s] + 1;
        pos = y.indexOf(s, pos > r ? pos : r);
        if (pos === -1) {
            pos = n;
        }
        symbols[s] = pos;
        return pos;
    }
}

if (lcs([1, 2, 3, 4, 5, 8, 8], [2, 8, 8, 3, 0, 9, 4, 5]).join('') !== [2, 3, 4, 5].join('')) throw new Error('lcs mechanism works inproperly');

module.exports = function (a1, a2) {
    function mod(el) {
        return el.outerHTML || el.wholeText || (el.toString && el.toString()) || el;
    }

    function group(arr, refArr) {
        if (arr.length == 0) return [];
        if (refArr.length == 0) return [{prev: null, elements: arr.map(extract)}];
        var mappedRefArr = refArr.map(mod);
        return arr.reduce(function (obj, element) {
            var refArrIndex = mappedRefArr.indexOf(mod(element.prev));
            if ((obj.length == 0) || refArrIndex !== -1) obj[obj.length] = {
                prev: refArr[refArrIndex], //using refArr element instead of binded to the element, as they are identic, but prev is stored in virtual root to be added, but refArr is real document root-binded
                elements: []
            };

            obj[obj.length - 1].elements.push(extract(element));
            return obj;
        }, []);

        function extract(r) {
            return r.element
        }
    }

    function binder(el, index, arr) {
        return {
            element: el,
            prev: arr[index - 1],
            next: arr[index + 1]
        }
    }

    var a1 = Array.prototype.slice.call(a1),
        a1mod = a1.map(mod),
        a2 = Array.prototype.slice.call(a2),
        a2mod = a2.map(mod);

    var lcsList = lcs(a1mod, a2mod);

    var commonElements_a1 = a1.filter(function (el, index) {
            return lcsList.indexOf(a1mod[index]) !== -1;
        }),
        soleElements_a1 = a1.filter(function (el, index) {
            return lcsList.indexOf(a1mod[index]) === -1;
        }),
//        soleElements_a1_binded = a1.map(binder).filter(function (el, index) {
//            return lcsList.indexOf(a1mod[index]) === -1;
//        }),
        commonElements_a2 = a2.filter(function (el, index) {
            return lcsList.indexOf(a2mod[index]) !== -1;
        }),
        soleElements_a2 = a2.filter(function (el, index) {
            return lcsList.indexOf(a2mod[index]) === -1;
        }),
        soleElements_a2_binded = a2.map(binder).filter(function (el, index) {
            return lcsList.indexOf(a1mod[index]) === -1;
        });
    if (soleElements_a1.length + commonElements_a1.length !== a1.length) throw new Error;
    if (soleElements_a2.length + commonElements_a2.length !== a2.length) throw new Error;
    return {
        common: [commonElements_a1, commonElements_a2],
        remove: soleElements_a1,
        add: soleElements_a2,
        addGrouped: group(soleElements_a2_binded, commonElements_a1)
    };
    //hope memory wouldnt leak
//    Object.defineProperty(returnObject, 'destroy', {value: function(){
//        removeElements.forEach(function(record){
//            delete record.prev;
//            delete record.next;
//        });
//        addElements.forEach(function(record){
//            delete record.prev;
//            delete record.next;
//        });
//        addElementsMix.forEach(function(record){
//            delete record.prev;
//        });
//    }})
};