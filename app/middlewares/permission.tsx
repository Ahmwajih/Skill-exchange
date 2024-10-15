

export islogin = async (req: NextRequest, res: NextResponse, next: NextHandler) => {
    if (req.session.get('user')) {
        return res.redirect('/dashboard');
    }
    return next();
    }


export isActive = async (req: NextRequest, res: NextResponse, next: NextHandler) => {
        if (req.session.get('user').isActive) {
            return next();
        }
        return res.redirect('/login');
    }

export isAdmin = async (req: NextRequest, res: NextResponse, next: NextHandler) => {
        if (req.session.get('user').role === 'admin') {
            return next();
        }
        return res.redirect('/dashboard');
    }


