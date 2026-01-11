// src/config/viewEngine.js
import express from 'express';
import path from 'path';
import appRoot from 'app-root-path';

const configViewEngine = (app) => {
  const staticPath = path.join(appRoot.path, 'src/uploads/image'); 
  const staticPathProduct = path.join(appRoot.path, 'src/uploads/Product'); 
  app.use('/api/v1/public', express.static(staticPath));
app.use('/api/v1/Product', express.static(staticPathProduct));
};

export default configViewEngine
    
;
