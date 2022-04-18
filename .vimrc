let mapleader =","
set nocompatible
syntax on
set mouse=a
set clipboard=unnamedplus
set number
set encoding=utf-8
set showcmd
set ruler
set cursorline
set number
set numberwidth=1
set shiftwidth=4
set tabstop=4
set expandtab
set autoindent
filetype indent on

"plugins
so ~/configs/.vim/plugins.vim
so ~/configs/.vim/plugins-config.vim
so ~/configs/.vim/maps.vim

"themes
set termguicolors
let g:tokyonight_style = 'night'
let g:tokyonight_enable_italic = 1

colorscheme tokyonight

"lightline
set laststatus=2

if !has('gui_running')
  set t_Co=256
endif

let g:lightline = {
      \ 'colorscheme': 'one'(background=dark),
      \ }
      
let g:lightline = {}

let g:lightline.component_expand = {
      \  'linter_checking': 'lightline#ale#checking',
      \  'linter_infos': 'lightline#ale#infos',
      \  'linter_warnings': 'lightline#ale#warnings',
      \  'linter_errors': 'lightline#ale#errors',
      \  'linter_ok': 'lightline#ale#ok',
      \ }
let g:lightline.component_type = {
      \     'linter_checking': 'right',
      \     'linter_infos': 'right',
      \     'linter_warnings': 'warning',
      \     'linter_errors': 'error',
      \     'linter_ok': 'right',
      \ }
let g:lightline.active = { 'right': [[ 'linter_checking', 'linter_errors', 'linter_warnings', 'linter_infos', 'linter_ok' ]] }

let g:lightline.active = {
            \ 'right': [ [ 'linter_checking', 'linter_errors', 'linter_warnings', 'linter_infos', 'linter_ok' ],
            \            [ 'lineinfo' ],
	    \            [ 'percent' ],
	    \            [ 'fileformat', 'fileencoding', 'filetype'] ] }


let g:lightline#ale#indicator_checking = "\uf110"
let g:lightline#ale#indicator_infos = "\uf129"
let g:lightline#ale#indicator_warnings = "\uf071"
let g:lightline#ale#indicator_errors = "\uf05e"
let g:lightline#ale#indicator_ok = "\uf00c"

"searching
set hlsearch        "highlight matches
set incsearch       "incremental searching
set ignorecase      "searche are case insensitive...
set smartcase       "... unless they contain at least one capital letter
