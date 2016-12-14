class Position
{
    constructor(data)
    {
        this.x = data["x"];
        this.y = data["y"];
        this.z = data["z"];
        this.absolute = data["absolute"] || false;
        this.speed = data["speed"];
    }
    
    add(other)
    {
        this.x = this._sum(this.x, other.x);
        this.y = this._sum(this.y, other.y);
        this.z = this._sum(this.z, other.z);
        this.absolute = this.absolute || other.absolute;
        this.speed = this.speed || other.speed;
        return this;
    }
    
    _sum(a, b)
    {
        if (a == undefined && b == undefined)
            return undefined
        
        return (a || 0.0) + (b || 0.0);
    }
}