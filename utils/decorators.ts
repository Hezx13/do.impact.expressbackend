import { Request, Response, NextFunction } from 'express';

function LogRoute(message: string) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor {
      const originalMethod = descriptor.value;
  
      descriptor.value = function(...args: any[]) {
        const req: Request = args[0];
        const res: Response = args[1];
        const method = req.method;
  
        const colors: { [key: string]: string } = {
          GET: '\x1b[34m', // Blue
          POST: '\x1b[32m', // Green
          PUT: '\x1b[33m', // Yellow
          DELETE: '\x1b[31m', // Red
          RESET: '\x1b[0m' // Reset
        };
        const colorsRes: { [key: string]: string } = {
            2: '\x1b[32m', // Green
            3: '\x1b[34m', // Blue
            4: '\x1b[33m', // Yellow
            5: '\x1b[31m', // Red
          };
  
        const color = colors[method] || colors.RESET;
  
        console.log(`\u001b[30m${message}: ${color}${method} ${req.path}${colors.RESET}`);
  
        const result = originalMethod.apply(this, args);
  
        res.on('finish', () => {
          const colorRes = colorsRes[res.statusCode/100] || colorsRes.RESET;
            
          console.log(`\u001b[30mResponse Status: ${colorRes}${res.statusCode}${colors.RESET}`);
        });
  
        return result;
      };
  
      return descriptor;
    };
  }
  
export default LogRoute;