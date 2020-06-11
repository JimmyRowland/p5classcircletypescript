import React, { useRef, useEffect } from "react";
import p5, {Vector} from "p5";

const classes = [{name:"Rock"},{name:"Paper"},{name:"Paper"},{name:"Paper"},{name:"Paper"},{name:"Paper"}]
interface MethodCall{
    className: string;
    numberOfField: number;
    parentClass: string;
    methodName: string;
    methodCalls: MethodCall[];
}
const json: MethodCall[] =
    [
        {
            parentClass: "",
            className: "Main",
            numberOfField: 5,
            methodName:"main",
            methodCalls: [
                {
                    parentClass: "Main",
                    className: "Printer",
                    methodName:"print",
                    numberOfField: 5,
                    methodCalls: [
                        {
                            parentClass: "Printer",
                            className: "notPrinter",
                            methodName:"print",
                            numberOfField: 5,
                            methodCalls: [

                            ]
                        },
                        {
                            parentClass: "Printer",
                            className: "notPrinter",
                            methodName:"print",
                            numberOfField: 5,
                            methodCalls: [

                            ]
                        },
                        {
                            parentClass: "Printer",
                            className: "notPrinter",
                            methodName:"print",
                            numberOfField: 5,
                            methodCalls: [

                            ]
                        }

                    ]
                },
                {
                    parentClass: "Main",
                    className: "notPrinter",
                    methodName:"print",
                    numberOfField: 5,
                    methodCalls: [

                    ]
                },
                {
                    parentClass: "Main",
                    className: "notPrinter",
                    methodName:"print",
                    numberOfField: 5,
                    methodCalls: [

                    ]
                },
                {
                    parentClass: "Main",
                    className: "Printer",
                    methodName:"print",
                    numberOfField: 5,
                    methodCalls: [

                    ]
                },
                {
                    parentClass: "Main",
                    className: "Printer",
                    methodName:"print",
                    numberOfField: 5,
                    methodCalls: [

                    ]
                },
                {
                    parentClass: "Main",
                    className: "notPrinter",
                    methodName:"print",
                    numberOfField: 5,
                    methodCalls: [

                    ]
                }
            ]
        }
    ]

let red: number[] = [];
let green: number[] = [];
let blue: number[] = [];
const density = 1;
const padding = 30;
const initSpeed = 5;
const attractionConstant = 50000;
const dotOpacity = 255;

class SmallCircle{
    constructor(r: string) {
    }
}


class Circle{
    private p: p5;

    private charges: number[];
    private index: number;
    private isHovering: boolean = false;
    private radius: number = 0;
    private isVisible: boolean = true;
    private location: Vector;
    private velocity: Vector;
    private acceleration: Vector;
    private mass: number;
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
    public getRadius():number{
        return this.radius;
    }
    private increaseRadius(): void{
        const amount = 1;
        this.radius+=amount;
        this.mass = this.radius*this.radius;
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
        const dir = p5.Vector.sub(circle.getLocatoin(), this.location);
        // this.p.print(dir);
        if(dir.mag() > this.radius+circle.getRadius()){
            const force = circle.getCharge(this.index)/dir.mag()*attractionConstant;
            const force2 = this.charges[circle.getIndex()]/dir.mag()*attractionConstant;
            // this.p.print(`${this.charges[0]},${this.charges[1]},${force},${force2},${this.index},${circle.getIndex()}`);
            // console.log(this.charges);
            dir.normalize();

            const dir2 = dir.copy();
            dir2.mult(-1);
            dir.mult(force);
            dir2.mult(force2);
            this.applyforce(dir);
            circle.applyforce(dir2);

        }

    }

    public initsmallCircleXY():{x:number,y:number}{
        let a = this.p.random(0,Math.PI*2);
        let r = this.p.random(0,this.radius/2-5);
        return{x:r*this.p.cos(a),y:r*this.p.sin(a)}
    }

    public render():void{
        this.p.fill(red[this.index], green[this.index], blue[this.index], this.getOpacity());
        this.p.noStroke();
        this.p.ellipse(this.location.x, this.location.y, this.radius,this.radius);
        // const alpha = dotOpacity;
        // for(let i = 0; i < this.charges.length; i++){
        //     this.p.fill(red[i], green[i], blue[i], alpha);
        //     // for(let j = 0; j<this.charges[i];j++){
        //         // let vector = this.p.createVector(this.p.random(-1,1),this.p.random(-1,1));
        //         // vector.normalize();
        //         // let a = this.p.random(0,Math.PI*2);
        //         // let r = this.p.random(0,this.radius/2-5);
        //         // this.p.ellipse(this.location.x+vector.x*this.radius, this.location.y+vector.y*this.radius,10);
        //         // this.p.ellipse(this.location.x+r*this.p.cos(a), this.location.y+r*this.p.sin(a),10);
        //     // }
        // }
        this.move();
    };

    private move():void{
        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);
        if((this.location.x>this.p.windowWidth-this.radius/2 && this.velocity.x>0) ||(this.location.x<this.radius/2 && this.velocity.x<0)){
            this.velocity.x = -1*this.velocity.x;
        }
        if((this.location.y>this.p.windowHeight-this.radius/2 && this.velocity.y>0) ||(this.location.y<this.radius/2 && this.velocity.y<0)){
            this.velocity.y *= -1;
        }
        this.acceleration.mult(0);
        const alpha = dotOpacity;
        for(let i = 0; i < this.charges.length; i++){
            this.p.fill(red[i], green[i], blue[i], alpha);
            for(let j = 0; j<this.charges[i];j++){
                let position = this.initsmallCircleXY();
                this.p.ellipse(this.location.x+position.x, this.location.y+position.y,10);
            }
        }
    }

    private getOpacity():number{
        return this.isHovering? 255:200;
    }
}

const sketch = (p:p5) => {
    let x = 0;
    let y = 0;
    let circles: Circle[] = [];
    p.setup = () => {

        for(let i = 0; i<classes.length; i++) {
            red.push(p.map(i,0,classes.length,100,255));
        }
        red = p.shuffle(red);
        green =p.shuffle(red);
        blue = p.shuffle(red);
        p.createCanvas(window.innerWidth, window.innerHeight);
        drawBackground();
        setupPosition();
        for(let i = 0; i< classes.length; i++){
            circles.push(new Circle(p,classes.length,i))
        }
        circles[0].increaseCharge(1,5);
        circles[1].increaseCharge(0,5);

    };

    const setupPosition = () => {
        x = p.windowWidth / 2;
        y = p.windowHeight / 2;
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        drawBackground();
        setupPosition();
    };

    const drawBackground = () => {
        p.background(0);
    };

    p.draw = () => {
        p.background(0);
        p.fill(255, 255, 255, 25);
        p.noStroke();
        p.ellipse(x, y, 48, 48);

        x = x + p.random(-10, 10);
        y = y + p.random(-10, 10);
        for(let i = 0; i< classes.length; i++){

            for(let j = i; j<classes.length; j++){
                circles[i].attracted(circles[j]);
            }
            circles[i].render();
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
