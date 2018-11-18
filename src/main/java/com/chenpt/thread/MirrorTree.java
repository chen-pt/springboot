package com.chenpt.thread;

/**
 * Created by chenpt on 2018/11/17.
 */
public class MirrorTree {

    public static void main(String[] args){
        MirrorTree mirrorTree = new MirrorTree();
        TreeNode treeNode = mirrorTree.createTree(null);
        mirrorTree.printTree(treeNode);
        System.out.println("\n镜像后");
        mirrorTree.mirror(treeNode);
        mirrorTree.printTree(treeNode);
    }

    class TreeNode {
        int val = 0;
        TreeNode left = null;
        TreeNode right = null;

        public TreeNode(int val) {
            this.val = val;
        }

    }

    /**
     * 创建二叉树
     * @param root
     * @return
     */
    public TreeNode createTree(TreeNode root) {
        TreeNode tree = new TreeNode(1);
        if (root == null)
            root = tree;

        tree.left = new TreeNode(2);
        tree.right = new TreeNode(3);
        tree.left.left = new TreeNode(4);
        tree.left.right = new TreeNode(5);

        return root;
    }

    /**
     * 中序打印二叉树
     * @param node
     */
    private void printTree(TreeNode node) {
        if (node == null)
            return ;
        printTree(node.left);
        System.out.print(node.val);
        printTree(node.right);
    }

    /**
     * 获取镜像树
     * @param root
     */
    public void mirror(TreeNode root) {
        if (root == null)
            return;
        if (root.left == null && root.right == null)
            return;
        // 交换左右子树
        TreeNode tmp = null;
        tmp = root.right;
        root.right = root.left;
        root.left = tmp;
        // 递归
        if (root.left != null)
            mirror(root.left);
        if (root.right != null)
            mirror(root.right);
    }

}
