#
# Cookbook Name:: Buffer
# Recipe:: default
#
# Copyright (C) 2015 YOUR_NAME
#
# All rights reserved - Do Not Redistribute
#

include_recipe 'apt'
include_recipe 'nodejs'

nodejs_npm 'grunt-cli'
nodejs_npm 'nodemon'

# Automatically cd to the root directory
execute "echo \"cd #{node['buffer']['root_directory']}\" >> /home/vagrant/.bashrc"

execute 'npm install' do
	cwd node['buffer']['root_directory']
end