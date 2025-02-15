import React, { useEffect, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { useRouter } from "next/navigation";
import { getAuth, User } from "firebase/auth";
import MenuIcon from "@mui/icons-material/Menu";

export default function NavMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // New state for admin status
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [submenuAnchorEl, setSubmenuAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const open = Boolean(anchorEl);
  const submenuOpen = Boolean(submenuAnchorEl);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((loggedInUser) => {
      setUser(loggedInUser);
      if (loggedInUser) {
        // Check if firebase user has admin custom claim
        loggedInUser.getIdTokenResult().then((idTokenResult) => {
          setIsAdmin(!!idTokenResult.claims.admin);
        });
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSubmenuAnchorEl(null); // Close submenu as well
  };

  const handleIssue = (event: React.MouseEvent<HTMLElement>) => {
    setSubmenuAnchorEl(event.currentTarget); // Open submenu
  };

  const handleLogout = async () => {
    const auth = getAuth();
    await auth.signOut();
    router.push("/auth");
    handleClose();
  };

  const handleLogin = async () => {
    router.push("/auth");
    handleClose();
  };

  const handleNavigation = (type: string) => {
    router.push(`/requests?type=${type}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <IconButton
        size="large"
        edge="end"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
      {!user ? (
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleLogin}>Login</MenuItem>
        </Menu>
      ) : (
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleIssue}>Submit Issue</MenuItem>
          {/* Render admin-only routes */}
          {isAdmin &&
              [
                <MenuItem key="dashboard" onClick={() => router.push("/dashboard")}>
                  Admin Dashboard
                </MenuItem>,
                <MenuItem key="guides" onClick={() => router.push("/guides")}>
                  Manage Guides
                </MenuItem>,
                <MenuItem key="admins" onClick={() => router.push("/admins")}>
                  Manage Admins
                </MenuItem>,
              ]}

          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      )}

      {/* Submenu for "Submit Issue" */}
      <Menu
        id="submenu-issue"
        anchorEl={submenuAnchorEl}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={submenuOpen}
        onClose={() => setSubmenuAnchorEl(null)}
      >
        <MenuItem onClick={() => handleNavigation("supportRequests")}>
          Bug Report
        </MenuItem>
        <MenuItem onClick={() => handleNavigation("featureRequests")}>
          Feature Request
        </MenuItem>
      </Menu>
    </div>
  );
}
