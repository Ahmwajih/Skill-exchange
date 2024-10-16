// import { NextRequest, NextResponse } from 'next/server';
// import { NextHandler } from 'next/dist/server/next';
// import session from next-session;

// export const isLogin = async (req: NextRequest, res: NextResponse, next: NextHandler) => {
//     const user = req.session.get('user');
//     if (user) {
//         return res.redirect('/dashboard');
//     }
//     return next();
// };

// export const isActive = async (req: NextRequest, res: NextResponse, next: NextHandler) => {
//     const user = req.session.get('user');
//     if (user && user.isActive) {
//         return next();
//     }
//     return res.redirect('/login');
// };

// export const isAdmin = async (req: NextRequest, res: NextResponse, next: NextHandler) => {
//     const user = req.session.get('user');
//     if (user && user.role === 'admin') {
//         return next();
//     }
//     return res.redirect('/dashboard');
// };