import React, { useRef, useEffect } from "react";
import p5, {Vector} from "p5";
import classesData from "./data/classes.json"
import methodCallsData from "./data/methodcalls.json"


interface MethodCall{
    classname: string;
    callFromClass: string;
    methodName: string;
    methodCalls: MethodCall[];
}
interface ClassInfo{
    interfaces: string[];
    classname: string;
    methods: string[];
    superclass: string;
    parentclass: string;
    fields: string[];
}

const getClassName= (index:number):string=>{
    return classes[index].classname;
}

const getClassnameIndexMap = (classes: ClassInfo[]) :Map<string,number>=>{
    let map: Map<string,number> = new Map();
    classes.map((info,index)=>{
        map.set(info.classname,index);
    });
    return map;
}

// const sleep = promisify(setTimeout);

const sleep = (milliseconds: number) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}



const methodCalls: MethodCall = methodCallsData;
const classes: ClassInfo[] = classesData;
const classMapIndex: Map<string,number> = getClassnameIndexMap(classes);

let red: number[] = [];
let green: number[] = [];
let blue: number[] = [];
//user defined parameters
let density = 0.01;
let padding = 30;
let initSpeed = 2;
let maxSpeed = 1;
let attractionConstant = 10000;
let smallCircleAttractionConstant = 10;
const dotOpacity = 255;
let interval = 50;
let weightMethods = 2.5;
let weightFields = 5;
let weightCallMethods = 0.2;
let initRadius = 40;
let collisionVelocityLoss = 0.2;
let alwaysVisible = true;
let smallCircleRadius = 5;
let smallCircleMass = 25;
let showSmallCircle = true;

class SmallCircle{
    private p: p5;
    private index: number;
    private location: Vector;
    private velocity: Vector;
    private acceleration: Vector;
    private parent: Circle;

    constructor(p5sketch:p5, index: number, location: Vector, parent: Circle) {
        this.p = p5sketch;
        this.location = location;
        this.index = index;
        this.velocity = this.p.createVector(this.p.random(-initSpeed,initSpeed),this.p.random(-initSpeed,initSpeed));
        this.acceleration = this.p.createVector(0,0);
        this.parent = parent;
    }

    public applyforce(force: Vector): void{
        this.acceleration.add(force.div(smallCircleMass));
    }
    public getLocatoin():Vector{
        return this.location;
    }
    public getIndex(): number{
        return this.index;
    }
    public attracted(circle: Circle):void{
            const dir = p5.Vector.sub(circle.getLocatoin(), this.location);
            // this.p.print(dir);
            if(dir.mag() > smallCircleRadius/2+circle.getRadius()/2){
                const force = smallCircleMass*circle.getMass()/dir.magSq()*smallCircleAttractionConstant;
                dir.normalize();
                dir.mult(force);
                this.applyforce(dir);
        }
    }

    public render():void{
        if(showSmallCircle){
            this.p.fill(red[this.index], green[this.index], blue[this.index], dotOpacity);
            this.p.noStroke();
            this.p.ellipse(this.location.x, this.location.y, smallCircleRadius);
            this.move();
        }
    };

    private move():void{
        this.attracted(this.parent);
        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);
        if((this.location.x>this.p.windowWidth-smallCircleRadius/2 && this.velocity.x>0) ||(this.location.x<smallCircleRadius/2 && this.velocity.x<0)){
            this.velocity.x = this.velocity.x > (maxSpeed)? -1*this.velocity.x * collisionVelocityLoss : this.velocity.x*-1;
        }
        if((this.location.y>this.p.windowHeight-smallCircleRadius/2 && this.velocity.y>0) ||(this.location.y<smallCircleRadius/2 && this.velocity.y<0)){
            this.velocity.y = this.velocity.y > (maxSpeed)? this.velocity.y*(-1*collisionVelocityLoss) : this.velocity.y*-1;
        }
        this.acceleration.mult(0);
    }


}

const calculateRadius = (numOfMethods: number, numOfFields: number) : number=>{
    return numOfFields*weightFields + numOfMethods * weightMethods + initRadius;
}

class Circle{
    private p: p5;
    private charges: number[];
    private index: number;
    private isHovering: boolean = false;
    private radius: number = 0;
    public isVisible: number = 0;
    private location: Vector;
    private velocity: Vector;
    private acceleration: Vector;
    private mass: number;
    private smallCircles: SmallCircle[] = [];

    constructor(p5sketch:p5,length: number, index: number, radius: number = 100) {
        this.p = p5sketch;

        this.location = this.p.createVector(this.p.random(padding,this.p.windowWidth),this.p.random(padding,this.p.windowHeight));
        // this.velocity = this.p.createVector(0,0);

        this.velocity = this.p.createVector(this.p.random(-initSpeed,initSpeed),this.p.random(-initSpeed,initSpeed));
        this.acceleration = this.p.createVector(0,0);

        this.charges = new Array(length+1).fill(0);
        // console.log(this.charges);
        this.index = index;
        this.radius = radius;
        this.mass = this.radius*this.radius*density;
    }
    public getMass(): number{
        return this.mass;
    }
    public updateMass():void{
        this.mass = this.radius*this.radius*density;
    }

    public getRadius():number{
        return this.radius;
    }
    private increaseRadius(): void{
        this.radius+=weightCallMethods;
        this.updateMass();
    }

    public increaseCharge(index: number, amount: number): void{
        this.charges[index]+=amount;
        console.log(this.charges);
    }

    public getCharge(index:number):number{
        return this.charges[index];
    }

    public applyforce(force: Vector): void{
        this.acceleration.add(force.div(this.mass));
        // this.p.print(this.acceleration);
    }
    public getLocatoin():Vector{
        return this.location;
    }
    public getIndex(): number{
        return this.index;
    }
    public attracted(circle: Circle):void{
        if(this.isVisible && circle.isVisible){
            const dir = p5.Vector.sub(circle.getLocatoin(), this.location);
            // this.p.print(dir);
            if(dir.mag() > this.radius/2+circle.getRadius()/2){
                const force = circle.getCharge(this.index)/dir.magSq()*attractionConstant;
                // const force2 = this.charges[circle.getIndex()]/dir.magSq()*attractionConstant;
                // this.p.print(`${this.charges[0]},${this.charges[1]},${force},${force2},${this.index},${circle.getIndex()}`);
                // console.log(this.charges);
                dir.normalize();

                // const dir2 = dir.copy();
                // dir2.mult(-1);
                dir.mult(force);
                // dir2.mult(force2);
                this.applyforce(dir);
                // circle.applyforce(dir2);
            }else{
                // this.velocity.mult(-1);
                // circle.velocity.mult(-1);
            }
        }
    }


    public render():void{
        if(alwaysVisible || this.isVisible>0){
            this.p.fill(red[this.index], green[this.index], blue[this.index], this.getOpacity());
            this.p.noStroke();
            this.p.ellipse(this.location.x, this.location.y, this.radius,this.radius);
            this.move();
            for(let smallCircle of this.smallCircles){
                smallCircle.render();
            }
        }
    };

    private populaterandomCircleInside(){
        const alpha = dotOpacity;
        for(let i = 0; i < this.charges.length; i++){
            this.p.fill(red[i], green[i], blue[i], alpha);
            for(let j = 0; j<this.charges[i];j++){
                let vector = this.p.createVector(this.p.random(-1,1),this.p.random(-1,1));
                vector.normalize();
                let a = this.p.random(0,Math.PI*2);
                let r = this.p.random(0,this.radius/2-5);
                this.p.ellipse(this.location.x+vector.x*this.radius, this.location.y+vector.y*this.radius,10);
                this.p.ellipse(this.location.x+r*this.p.cos(a), this.location.y+r*this.p.sin(a),10);
            }
        }
    }

    private move():void{
        for(let i = 0; i < circles.length; i++){
            if(this.index !== i){
                this.attracted(circles[i]);
            }
        }

        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);
        if((this.location.x>this.p.windowWidth-this.radius/2 && this.velocity.x>0) ||(this.location.x<this.radius/2 && this.velocity.x<0)){
            this.velocity.x = this.velocity.x > (maxSpeed)? -1*this.velocity.x * collisionVelocityLoss : this.velocity.x*-1;
        }
        if((this.location.y>this.p.windowHeight-this.radius/2 && this.velocity.y>0) ||(this.location.y<this.radius/2 && this.velocity.y<0)){
            this.velocity.y = this.velocity.y > (maxSpeed)? this.velocity.y*(-1*collisionVelocityLoss) : this.velocity.y*-1;
        }
        this.acceleration.mult(0);
        this.mouseOver();

    }

    private mouseOver():void{
        if(this.p.dist(this.location.x,this.location.y,this.p.mouseX,this.p.mouseY)<this.radius/2){
            this.isHovering = true;
        }else{
            this.isHovering =false;
        }
    }

    private getOpacity():number{
        return this.isHovering? 255:200;
    }

    public callMethod(index:number){
        if(index!==this.index){
            this.charges[index]++;
            // if(getClassName(this.index)==="ui.Main"){
            //     console.log("call from "+ getClassName(this.index));
            //     console.log("current class " + getClassName(index));
            //     console.log(this.charges.reduce((sum:number,value:number)=>{
            //         return sum+value;
            //     },0));
            //     console.log(this.charges[this.index])
            // }
            this.smallCircles.push(new SmallCircle(this.p,index,this.location.copy(), this));

        }
        this.increaseRadius();
    }

    public getClassName():string{
        return classes[this.index].classname;
    }
}
let circles: Circle[] = [];
const methodCall = async (method: MethodCall)=>{
    const name = method.classname;
    const index:number|undefined = classMapIndex.get(name);
    if(index!==undefined){
        const circle: Circle = circles[index];
        const callFromClassName = method.callFromClass;
        if(callFromClassName!==""){
            const indexCallFromClass:number|undefined = classMapIndex.get(callFromClassName);
            if(indexCallFromClass!==undefined){
                const circleCallFromClass: Circle = circles[indexCallFromClass];
                if(method.callFromClass==="ui.Main"){
                    console.log(method.classname+ " " + method.methodName);
                }
                circleCallFromClass.callMethod(index);
            }
        }

        circle.isVisible++;
        for(let call of method.methodCalls){
            await sleep(interval);
            // console.log(name+method.methodName);
            let message = await methodCall(call);
            // await sleep(interval);
            // console.log(message);
        }
        circle.isVisible--;
    }
    return "finish:"+name+method.methodName;
}

const sketch = (p:p5) => {

    p.setup = async () => {

        for(let i = 0; i<classes.length; i++) {
            red.push(p.map(i,0,classes.length,100,255));
        }
        red = p.shuffle(red);
        green =p.shuffle(red);
        blue = p.shuffle(red);
        p.createCanvas(window.innerWidth, window.innerHeight);
        drawBackground();
        for(let i = 0; i< classes.length; i++){
            let classInfo: ClassInfo = classes[i];
            let numOfField = classInfo.fields.length;
            let numOfmethods = classInfo.methods.length;
            circles.push(new Circle(p,classes.length,i, calculateRadius(numOfmethods,numOfField)));
        }
        await methodCall(methodCalls);
        // circles[0].increaseCharge(1,5);
        // circles[1].increaseCharge(0,5);

    };


    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        drawBackground();
    };

    const drawBackground = () => {
        p.background(0);
    };

    p.draw = () => {
        p.background(0);

        for(let i = 0; i< circles.length; i++){
            circles[i].render();
            // for(let j = i; j<circles.length; j++){
            //     circles[i].attracted(circles[j]);
            // }
        }
    };
};


export default function P5sketch() {
    const app = useRef<HTMLDivElement|null>(null);

    useEffect(() => {
        // @ts-ignore
        let newp5 = new p5(sketch, app.current);

        return () => {
            newp5.remove();
        };
    }, []);

    return <div ref={app} />;
}
