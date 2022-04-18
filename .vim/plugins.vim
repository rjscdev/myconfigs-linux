set nocompatible
call plug#begin('~/configs/.vim/plugged')

" syntax
Plug 'sheerun/vim-polyglot'

"statusbar
Plug 'maximbaz/lightline-ale'
Plug 'itchyny/lightline.vim'
Plug 'dense-analysis/ale'

"themes
Plug 'ghifarit53/tokyonight-vim'

"tree
Plug 'scrooloose/nerdtree'

"typing
Plug 'jiangmiao/auto-pairs'
Plug 'alvan/vim-closetag'
Plug 'tpope/vim-surround'

"autocomplete
Plug 'sirver/ultisnips'
Plug 'neoclide/coc.vim', {'branch': 'release'}

"testing
Plug 'janko-m/vim-test'

"IDE
Plug 'editorconfig/editorconfig-vim'
Plug 'junegunn/fzf'
Plug 'junegunn/fzf.vim'
Plug 'terryma/vim-multiple-cursors'
Plug 'easymotion/vim-easymotion'
Plug 'mhinz/vim-signify'
Plug 'yggdroot/indentline'
Plug 'scrooloose/nerdcommenter'

"git
Plug 'tpope/vim-fugitive'
Plug 'tpope/vim-repeat'

call plug#end()
