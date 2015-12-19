var t  = require('tap')
var Yallist = require('../yallist.js')

var y = new Yallist(1,2,3,4,5)
var z = new Yallist([1,2,3,4,5])
t.similar(y, z, 'build from single list or args')

function add10 (i) {
  return i + 10
}
t.similar(y.map(add10).toArray(), [11, 12, 13, 14, 15])
t.similar(y.mapReverse(add10).toArray(), [15, 14, 13, 12, 11])

t.similar(y.map(add10).toArrayReverse(), [15, 14, 13, 12, 11])
t.isa(Yallist(1,2,3), 'Yallist')
t.equal(y.push(6, 7, 8), 8)
t.similar(y.toArray(), [1, 2, 3, 4, 5, 6, 7, 8])
y.pop()
y.shift()
y.unshift(100)

var expect = [100, 2, 3, 4, 5, 6, 7]
var expectReverse = [ 7, 6, 5, 4, 3, 2, 100 ]

t.similar(y.toArray(), expect)
t.equal(y.length, y.toArray().length)

t.test(function forEach (t) {
  t.plan(y.length * 2)
  y.forEach(function (item, i, list) {
    t.equal(item, expect[i])
    t.equal(list, y)
  })
})

t.test(function forEach (t) {
  t.plan(y.length * 5)
  var n = 0
  y.forEachReverse(function (item, i, list) {
    t.equal(item, expectReverse[n])
    t.equal(item, expect[i])
    t.equal(item, y.get(i))
    t.equal(item, y.getReverse(n))
    n += 1
    t.equal(list, y)
  })
})

t.equal(y.getReverse(100), undefined)

t.equal(y.get(9999), undefined)


function sum (a, b) { return a + b }
t.equal(y.reduce(sum), 127)
t.equal(y.reduce(sum, 100), 227)
t.equal(y.reduceReverse(sum), 127)
t.equal(y.reduceReverse(sum, 100), 227)

t.equal(Yallist().pop(), undefined)
t.equal(Yallist().shift(), undefined)

var x = Yallist()
x.unshift(1)
t.equal(x.length, 1)
t.similar(x.toArray(), [1])

// verify that y.toArray() returns an array and if we create a
// new Yallist from that array, we get a list matching 
t.similar(Yallist(y.toArray()), y)
t.similar(Yallist.apply(null, y.toArray()), y)

t.throws(function () {
  new Yallist().reduce(function () {})
}, {}, new TypeError('Reduce of empty list with no initial value'))
t.throws(function () {
  new Yallist().reduceReverse(function () {})
}, {}, new TypeError('Reduce of empty list with no initial value'))

var z = y.reverse()
t.equal(z, y)
t.similar(y.toArray(), expectReverse)
y.reverse()
t.similar(y.toArray(), expect)

var a = Yallist(1,2,3,4,5,6)
var cases = [
  [ [2, 4], [3, 4] ],
  [ [2, -4], [] ],
  [ [2, -2], [3, 4] ],
  [ [1, -2], [2, 3, 4] ],
  [ [-1, -2], [] ],
  [ [-5, -2], [2, 3, 4] ],
  [ [-99, 2], [1, 2] ],
  [ [5, 99], [6] ],
  [ [], [1,2,3,4,5,6] ]
]
t.test('slice', function (t) {
  t.plan(cases.length)
  cases.forEach(function (c) {
    t.test(JSON.stringify(c), function (t) {
      t.similar(a.slice.apply(a, c[0]), Yallist(c[1]))
      t.similar([].slice.apply(a.toArray(), c[0]), c[1])
      t.end()
    })
  })
})

t.test('sliceReverse', function (t) {
  t.plan(cases.length)
  cases.forEach(function (c) {
    var rev = c[1].slice().reverse()
    t.test(JSON.stringify([c[0], rev]), function (t) {
      t.similar(a.sliceReverse.apply(a, c[0]), Yallist(rev))
      t.similar([].slice.apply(a.toArray(), c[0]).reverse(), rev)
      t.end()
    })
  })
})

var inserter = Yallist(1,2,3,4,5)
inserter.moveToHead(inserter.head.next)
t.similar(inserter.toArray(), [2,1,3,4,5])
inserter.moveToHead(inserter.tail)
t.similar(inserter.toArray(), [5,2,1,3,4])
inserter.moveToHead(inserter.head)
t.similar(inserter.toArray(), [5,2,1,3,4])

var single = Yallist(1)
single.moveToHead(single.head)
t.similar(single.toArray(), [1])

inserter = Yallist(1,2,3,4,5)
inserter.moveToTail(inserter.tail.prev)
t.similar(inserter.toArray(), [1,2,3,5,4])
inserter.moveToTail(inserter.head)
t.similar(inserter.toArray(), [2,3,5,4,1])
inserter.moveToHead(inserter.head)
t.similar(inserter.toArray(), [2,3,5,4,1])

single = Yallist(1)
single.moveToTail(single.tail)
t.similar(single.toArray(), [1])

// Note: this is a very bad idea.  swiper no swiping!
// If you swipe a head or tail, you break the list in a weird way.
var swiped = Yallist(9,8,7)
inserter.moveToHead(swiped.head.next)
t.similar(inserter.toArray(), [8,2,3,5,4,1])
t.similar(swiped.toArray(), [9,7])

swiped = Yallist(9,8,7)
inserter.moveToTail(swiped.head.next)
t.similar(inserter.toArray(), [8,2,3,5,4,1,8])
t.similar(swiped.toArray(), [9,7])

swiped.moveToHead(Yallist.Node(99, null, null))
t.similar(swiped.toArray(), [99,9,7])
swiped.moveToTail(Yallist.Node(66, null, null))
t.similar(swiped.toArray(), [99,9,7,66])

var e = Yallist()
e.moveToHead(Yallist.Node(1))
t.same(e.toArray(), [1])
e = Yallist()
e.moveToTail(Yallist.Node(1))
t.same(e.toArray(), [1])
