///<reference path='../../typings/mocha/mocha.d.ts'/>
///<reference path='../../typings/node/node.d.ts'/>
///<reference path='../../typings/underscore/underscore.d.ts'/>

var Utils = require('../../src/validation/Utils.js');

var expect = require('expect.js');

//leaf
class Item {

    constructor(private name: string, private value:string){

    }
    add(child):boolean
    {
        throw new Error("this object is Item.");
    }
    remove(child):boolean{
        throw new Error("this object is Item.");
    }
    getChildren(){
        throw new Error("this object is Item.");
    }
    getName():string{
        return this.name;
    }
    getValue():string{
        return this.value;
    }
    isItem():boolean{
        return true;
    }
}
//composite
class Directory {
    items;
    constructor(private name: string, private value:string){
        this.items = new Array();
    }
    add(child):boolean{
        this.items.push(child);
        return true;
    }
    remove(child):boolean{
        for (var i : number = this.items.length - 1; i >= 0; i--) {
            if(this.items[i].getName() === child.getName()){
                this.items.splice(i, 1);
                i++;
            }
        }
        return true;
    }
    getChildren(){
        return this.items;
    }
    getName():string{
        return this.name;
    }
    getValue():string{
        return this.value;
    }
    isItem():boolean{
        return false;
    }
}

describe('CompositeDotObject', function () {

    it('contains all properties', function () {
        //when
        var root = new Directory("Root","Root");
        var dir = new Directory("A","Root.A");
        dir.add(new Item("a","Root.A.a"))
        dir.add(new Item("b","Root.A.b"))
        dir.add(new Item("c","Root.A.c"))
        root.add(dir);

        dir = new Directory("B","Root.B");
        dir.add(new Item("a","Root.B.a"))
        dir.add(new Item("b","Root.B.b"))
        root.add(dir);

        //exec
        var compDotObject = Utils.CompositeDotObject.Transform(root);

        //verify
        expect(compDotObject.Root.getName()).to.equal("Root");
        expect(compDotObject.Root.A.getName()).to.equal("A");
        expect(compDotObject.Root.B.getName()).to.equal("B");

        expect(compDotObject.Root.getValue()).to.equal("Root");
        expect(compDotObject.Root.A.getValue()).to.equal("Root.A");
        expect(compDotObject.Root.B.getValue()).to.equal("Root.B");


        expect(compDotObject.Root.A.a.getValue()).to.equal("Root.A.a");
        expect(compDotObject.Root.A.b.getValue()).to.equal("Root.A.b");
        expect(compDotObject.Root.A.c.getValue()).to.equal("Root.A.c");

        expect(compDotObject.Root.B.a.getValue()).to.equal("Root.B.a");
        expect(compDotObject.Root.B.b.getValue()).to.equal("Root.B.b");
        expect(compDotObject.Root.B.c).to.equal(undefined);
    });
});