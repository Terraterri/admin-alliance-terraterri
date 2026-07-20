import { Sidebar, SubMenu, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const Sidebars = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      label: 'Expo Dashboard',
      url: "/dashboard",
      className: 'active',
    },

    {
      label: 'Expo Master',
      subMenu: [
        // {
        //   label: 'Expo Type',
        //   url: "/expo/type",
        // },
        // {
        //   label: 'Country Master',
        //   url: "/masters/country",
        // },
        // {
        //   label: 'City Master',
        //   url: "/masters/city",
        // },
        {
          label: 'Expo Banner Image',
          url: "/expo-banner",
        },
        {
          label: 'Create Package',
          url: "/package/add",
        },
        // {
        //   label: 'Add Source',
        //   url: "/source"
        // },

      ],
    },
    {
      label: 'Expo Management',
      subMenu: [
        // {
        //   label: 'Create Expo',
        //   url: "/expo/create",
        // },
        {
          label: 'OnGoing Expo',
          url: "/expo/ongoing",
        },
        // {
        //   label: 'Future Expo',
        //   url: "/expo/future",
        // },
        {
          label: 'Completed Expo',
          url: "/expo/completed",
        },
        // {
        //   label: 'Deleted Expo',
        //   url: "/expo/deleted",
        // },
      ],
    },
    {
      label: 'Expo Configuration',
      url: "expo-configuration",
    },
    {
      label: 'Responses',
      url: "/connect-inquiries",
    },

    {
      label: 'Exhibitors Management',
      url: "builderparticipate",
    },

    {
      label: 'Visitor Management',
      subMenu: [
        {
          label: 'Visitor Registrations',
          url: "/visitors-by-expo",
        },
        {
          label: 'Visitor Entries',
          url: "/visitors-summary",
        },
        {
          label: 'Block Visitors',
          url: "/block-number"
        },

      ]

    },

  ];


  return (
    <Sidebar>
      <Menu>

        {menuItems.map((item, index) => {
          if (item.subMenu) {
            return (
              <SubMenu key={index} label={item.label} className={item.subMenu.includes(currentPath) ? 'active' : ''}>
                {item.subMenu.map((subItem, subIndex) => (
                  <MenuItem key={subIndex} component={<Link to={subItem.url} />}
                    className={currentPath === subItem.url ? 'active' : ''}>
                    {subItem.label}
                  </MenuItem>
                ))}
              </SubMenu>
            );
          } else {
            return (
              <MenuItem key={index} component={<Link to={item.url} />} className={currentPath === item.url ? 'active' : ''}>
                {item.label}
              </MenuItem>
            );
          }
        })}

        {/* <MenuItem component={<Link to="/home" />}>Dashboard </MenuItem>
        <MenuItem component={<Link to="/expodashboard" />} className='active'>
          Expo Dashboard
        </MenuItem>
        <SubMenu label="Expo Master">
          <MenuItem component={<Link to="/" />} className='active'> Expo Type</MenuItem>
          <MenuItem component={<Link to="/expotype" />}>Expo Type</MenuItem>
          <MenuItem component={<Link to="/bookingmonths" />}>Package Tenure</MenuItem>
          <MenuItem component={<Link to="/countrymaster" />}>Country Master</MenuItem>
          <MenuItem component={<Link to="/citymaster" />}>City Master</MenuItem>
          <MenuItem component={<Link to="/expobanimage" />}>Expo Banner Image</MenuItem>
          <MenuItem component={<Link to="/createpackage" />}>Create Package</MenuItem>
          <MenuItem component={<Link to="/addbudget" />}>Add Budget</MenuItem>
          <MenuItem component={<Link to="/solution" />}>Solutions</MenuItem>
          <MenuItem component={<Link to="/addimage" />}>AddImage</MenuItem>

          <MenuItem component={<Link to="/percentagediscounts" />}>Percentage of Discount</MenuItem>
          <MenuItem component={<Link to="/createstallname" />}>Create Stall Names</MenuItem>
        </SubMenu>
        < SubMenu label="Expo Management">
          <MenuItem component={<Link to="/multistepForm" />}>Create Expo</MenuItem>
          <MenuItem component={<Link to="/ongoingexpo" />}>OnGoing Expo</MenuItem>
          <MenuItem component={<Link to="/futureExpo" />}>Future Expo</MenuItem>
          <MenuItem component={<Link to="/completedExpo" />}>Completed Expo</MenuItem>
        </SubMenu>
        < SubMenu label="Package Stalls">
          <MenuItem component={<Link to="/daimondstall" />}>Diamond Stall</MenuItem>
          <MenuItem component={<Link to="/platinumstall" />}>Platinum Stall</MenuItem>
          <MenuItem component={<Link to="/goldstall" />}>Gold Stall</MenuItem>
          <MenuItem component={<Link to="/standardstall" />}>Standard Stall</MenuItem>
        </SubMenu>
        <SubMenu label="Packages">
          <MenuItem component={<Link to="/addpackage" />}>Add Package</MenuItem>
          <MenuItem component={<Link to="/packagelists" />}>Package List</MenuItem>
        </SubMenu>
        <MenuItem component={<Link to="/connectForm" />} > Responses</MenuItem>

       */}
      </Menu>
    </Sidebar>
  );
};

export default Sidebars;
